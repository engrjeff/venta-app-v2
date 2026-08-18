import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { generateId } from "@/lib/utils"
import { ArrowRightIcon, ListFilterIcon, XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useCallback, useReducer, useState } from "react"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"

import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "../ui/badge"

export type FilterOption = {
  label: string
  value: string
}

export type FilterFieldType = "select"

export type FilterValueRenderProps = {
  values: string[]
  options: FilterOption[]
}

export type FilterField = {
  id: string
  label: string
  type: FilterFieldType
  options?: FilterOption[]

  renderValue?: (props: FilterValueRenderProps) => ReactNode
}

export type FilterOperator = "is" | "is_not"

export type FilterValue = string[]

export function rulesToQuery(rules: FilterRule[]) {
  return Object.fromEntries(
    rules.map((rule) => [
      rule.field,
      {
        operator: rule.operator,
        value: rule.value,
      },
    ])
  )
}

type FilterQuery = Record<
  string,
  | {
      operator: FilterOperator
      value: string[]
    }
  | undefined
>

export function queryToFilterRules<T extends FilterQuery>(
  query: T,
  fields: FilterField[]
): FilterRule[] {
  return (Object.keys(query) as Array<keyof T>)
    .map((fieldId) => {
      const filter = query[fieldId]

      if (!filter) {
        return null
      }

      const field = fields.find((_field) => _field.id === String(fieldId))

      if (!field) {
        return null
      }

      return {
        id: field.id,
        field: field.id,
        label: field.label,
        operator: filter.operator,
        value: filter.value,
      }
    })
    .filter((rule): rule is FilterRule => rule !== null)
}

export type FilterRule = {
  /**
   * Used only by React/UI.
   *
   * This is intentionally not serialized to the URL.
   */
  id: string

  field: string
  label: string
  operator: FilterOperator
  value: FilterValue
}

const OPERATORS: Record<FilterOperator, string> = {
  is: "Is",
  is_not: "Is not",
}

export type FilterBuilderProps = {
  fields: FilterField[]

  /**
   * Applied filters.
   */
  value?: FilterRule[]

  /**
   * Called when filters are committed — either by clicking Apply, or
   * immediately when a filter chip is removed via its X icon.
   *
   * NOT called for in-progress draft edits (e.g. toggling a checkbox
   * inside the filter popover) — those only update local draft state
   * until Apply is clicked.
   */
  onChange?: (filters: FilterRule[]) => void

  /**
   * Called when the user clicks Apply.
   *
   * Unlike onChange, this is NOT called when a filter chip is removed
   * via its X icon — that action only triggers onChange.
   */
  onApply?: (filters: FilterRule[]) => void

  /**
   * Called when the user clicks Clear.
   */
  onClear?: () => void

  className?: string
}

function createEmptyRule(field: FilterField): FilterRule {
  return {
    id: generateId(),
    field: field.id,
    label: field.label,
    operator: "is",
    value: [],
  }
}

type DraftRuleAction =
  | { type: "reseed"; rule: FilterRule }
  | { type: "clear" }
  | { type: "set_operator"; operator: FilterOperator }
  | { type: "toggle_value"; value: string }

/**
 * Pure update logic for a single draft FilterRule. Shared by every popover
 * so "how a checkbox toggle changes the draft" is written exactly once.
 *
 * State is nullable because AddFilterPopover doesn't have a field picked
 * (and therefore no draft rule) until the user clicks one from the list.
 */
function draftRuleReducer(
  state: FilterRule | undefined,
  action: DraftRuleAction
): FilterRule | undefined {
  switch (action.type) {
    case "reseed":
      return action.rule
    case "clear":
      return undefined
    case "set_operator":
      return state ? { ...state, operator: action.operator } : state
    case "toggle_value": {
      if (!state) return state
      const isSelected = state.value.includes(action.value)
      return {
        ...state,
        value: isSelected
          ? state.value.filter((v) => v !== action.value)
          : [...state.value, action.value],
      }
    }
    default:
      return state
  }
}

/**
 * Local, per-popover draft of a single FilterRule, for popovers that
 * always have a field to edit (i.e. every popover except AddFilterPopover,
 * which manages its reducer directly since its draft starts undefined).
 *
 * `reseed` should be called from the popover's onOpenChange(true) handler
 * so the draft always starts fresh from whatever is currently applied —
 * this is what makes Cancel "free" (nothing to undo, the draft just gets
 * discarded and re-seeded next time the popover opens).
 */
function useDraftRule(
  committedRule: FilterRule | undefined,
  field: FilterField
) {
  const [draft, dispatch] = useReducer(
    draftRuleReducer,
    committedRule ?? createEmptyRule(field)
  )

  const reseed = useCallback(() => {
    dispatch({ type: "reseed", rule: committedRule ?? createEmptyRule(field) })
  }, [committedRule, field])

  // draft is never undefined here: the reducer only returns undefined on
  // "clear", which this hook never dispatches.
  return [draft as FilterRule, dispatch, reseed] as const
}

function renderFilterValue(filterRule: FilterRule, field: FilterField) {
  if (field.renderValue) {
    return field.renderValue({
      values: filterRule.value,
      options: field.options ?? [],
    })
  }

  const labels = filterRule.value.map(
    (val) => field.options?.find((option) => option.value === val)?.label ?? val
  )

  const MAX_DISP = 2
  const MORE_COUNT = labels.length > MAX_DISP ? labels.length - MAX_DISP : 0

  return (
    <Badge className="rounded bg-blue-900/60 text-blue-400">
      {labels.slice(0, MAX_DISP).join(", ")}{" "}
      {MORE_COUNT > 0 ? `+${MORE_COUNT} more` : null}
    </Badge>
  )
}

/**
 * Popover for changing just the operator ("is" / "is not") on an
 * already-applied chip. Same draft-then-Apply shape as ValuePopover,
 * just editing `operator` instead of `value`.
 */
function OperatorPopover({
  rule,
  field,
  onApplyRule,
}: {
  rule: FilterRule
  field: FilterField
  onApplyRule: (rule: FilterRule) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, dispatch, reseed] = useDraftRule(rule, field)

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) reseed()
    setOpen(isOpen)
  }

  function handleApply() {
    onApplyRule(draft)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            {OPERATORS[rule.operator].toLowerCase()}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto min-w-32 gap-0 p-0">
        <PopoverHeader className="px-3 py-2">
          <PopoverTitle>Operator</PopoverTitle>
          <PopoverDescription className="sr-only">
            Choose an operator for {field.label}
          </PopoverDescription>
        </PopoverHeader>
        <Separator />
        <ul className="space-y-0.5 p-1">
          {Object.entries(OPERATORS).map(([operator, operatorLabel]) => (
            <li key={operator}>
              <label className="group flex w-full cursor-pointer items-center gap-2 rounded-sm p-1 text-sm hover:bg-accent">
                <Checkbox
                  checked={draft.operator === operator}
                  onCheckedChange={() =>
                    dispatch({
                      type: "set_operator",
                      operator: operator as FilterOperator,
                    })
                  }
                />
                <span>{operatorLabel}</span>
              </label>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex items-center justify-between gap-2 p-1">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/** Popover for changing the selected values on an already-applied chip. */
function ValuePopover({
  rule,
  field,
  onApplyRule,
}: {
  rule: FilterRule
  field: FilterField
  onApplyRule: (rule: FilterRule) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, dispatch, reseed] = useDraftRule(rule, field)

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) reseed()
    setOpen(isOpen)
  }

  function toggleValue(value: string) {
    dispatch({ type: "toggle_value", value })
  }

  function handleApply() {
    onApplyRule(draft)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            {renderFilterValue(rule, field)}
          </Button>
        }
      />
      <PopoverContent align="start" className="w-auto min-w-40 gap-0 p-0">
        <PopoverHeader className="px-3 py-2">
          <PopoverTitle>{field.label}</PopoverTitle>
          <PopoverDescription className="sr-only">
            {field.label}
          </PopoverDescription>
        </PopoverHeader>
        <Separator />
        <ul className="space-y-0.5 p-1">
          {field.options?.map((option) => {
            const checked = draft.value.includes(option.value)

            return (
              <li key={option.value}>
                <label className="group flex w-full cursor-pointer items-center gap-2 rounded-sm p-1 text-sm hover:bg-accent">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleValue(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              </li>
            )
          })}
        </ul>
        <Separator />
        <div className="flex items-center justify-between gap-2 p-1">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * The top "+ Filters" button: pick a field, then set its operator and
 * values in one combined view. Same single-rule-draft shape as the
 * per-chip popovers above, just with a two-step (field list -> editor)
 * navigation on top.
 */
function AddFilterPopover({
  fields,
  appliedRules,
  onApplyRule,
}: {
  fields: FilterField[]
  appliedRules: Map<string, FilterRule>
  onApplyRule: (rule: FilterRule) => void
}) {
  const [open, setOpen] = useState(false)
  const [openedField, setOpenedField] = useState<FilterField>()
  // Unlike useDraftRule, this draft genuinely starts undefined — no field
  // has been picked yet — so it drives the reducer directly rather than
  // going through the always-defined wrapper.
  const [draft, dispatch] = useReducer(draftRuleReducer, undefined)

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setOpenedField(undefined)
      dispatch({ type: "clear" })
    }
    setOpen(isOpen)
  }

  function openField(field: FilterField) {
    setOpenedField(field)
    dispatch({
      type: "reseed",
      rule: appliedRules.get(field.id) ?? createEmptyRule(field),
    })
  }

  function handleBack() {
    setOpenedField(undefined)
    dispatch({ type: "clear" })
  }

  function handleApply() {
    if (draft) onApplyRule(draft)
    setOpenedField(undefined)
    dispatch({ type: "clear" })
    setOpen(false)
  }

  const appliedFiltersCount = Array.from(appliedRules.values()).reduce(
    (count, rule) => count + rule.value.length,
    0
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={<Button size="sm" variant="outline" type="button" />}
      >
        <ListFilterIcon /> Filters{" "}
        {appliedFiltersCount ? (
          <Badge className="ml-1 rounded bg-blue-900/60 text-blue-400">
            {appliedFiltersCount}
          </Badge>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-40 gap-0 p-0">
        <PopoverHeader className="px-3 py-2">
          <PopoverTitle>
            {openedField ? openedField.label : "Filters"}
          </PopoverTitle>
          <PopoverDescription className="sr-only">
            Set filters to narrow-down the list
          </PopoverDescription>
        </PopoverHeader>

        <Separator />

        {openedField && draft ? (
          <div>
            <div className="flex divide-x">
              {/* operators */}
              <ul className="space-y-0.5 p-1">
                {Object.entries(OPERATORS).map(([operator, operatorLabel]) => (
                  <li key={`operator-${operator}`}>
                    <label className="group flex w-full cursor-pointer items-center gap-2 rounded-sm p-1 text-sm hover:bg-accent">
                      <Checkbox
                        checked={draft.operator === operator}
                        onCheckedChange={() =>
                          dispatch({
                            type: "set_operator",
                            operator: operator as FilterOperator,
                          })
                        }
                      />
                      <span>{operatorLabel}</span>
                    </label>
                  </li>
                ))}
              </ul>

              {/* options */}
              <ul className="space-y-0.5 p-1">
                {openedField.options?.map((option) => {
                  const checked = draft.value.includes(option.value)

                  return (
                    <li key={option.value}>
                      <label className="group flex w-full cursor-pointer items-center gap-2 rounded-sm p-1 text-sm hover:bg-accent">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            dispatch({
                              type: "toggle_value",
                              value: option.value,
                            })
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-2 p-1">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        ) : (
          <ul className="space-y-0.5 p-1">
            {fields.map((field) => (
              <li key={field.id}>
                <button
                  type="button"
                  className="group inline-flex w-full items-center justify-between gap-2 rounded-sm p-1 text-sm hover:bg-accent"
                  onClick={() => openField(field)}
                >
                  <span>{field.label}</span>{" "}
                  <ArrowRightIcon className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}

export function FilterBuilder({
  fields,
  value,
  onApply,
  onChange,
}: FilterBuilderProps) {
  const createFilterMap = (val?: FilterRule[]) =>
    new Map(val?.map((rule) => [rule.field, rule]))

  // The single source of truth for what's currently applied. Popovers
  // never touch this directly — they go through applyRule/removeRule.
  const [appliedRules, setAppliedRules] = useState<Map<string, FilterRule>>(
    () => createFilterMap(value)
  )

  // Used by every "Apply" button (add-filter, value popover, operator
  // popover): commits one rule and fires both callbacks together.
  function applyRule(rule: FilterRule) {
    const next = new Map(appliedRules)

    if (rule.value.length === 0) {
      next.delete(rule.field)
    } else {
      next.set(rule.field, rule)
    }

    setAppliedRules(next)

    const nextRules = Array.from(next.values())
    onApply?.(nextRules)
    onChange?.(nextRules)
  }

  // Used by the X icon: commits immediately, onChange only.
  function removeRule(fieldId: string) {
    const next = new Map(appliedRules)
    next.delete(fieldId)

    setAppliedRules(next)
    onChange?.(Array.from(next.values()))
  }

  const rulesArray = Array.from(appliedRules.values()).filter(
    (rule) => rule.value.length
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AddFilterPopover
        fields={fields}
        appliedRules={appliedRules}
        onApplyRule={applyRule}
      />

      {/* filter chips */}
      {rulesArray.map((rule) => {
        const field = fields.find((f) => f.id === rule.field)

        if (!field) {
          return null
        }

        return (
          <ButtonGroup key={rule.id}>
            <Button type="button" variant="outline" size="sm">
              {rule.label}
            </Button>

            <OperatorPopover
              rule={rule}
              field={field}
              onApplyRule={applyRule}
            />

            <ValuePopover rule={rule} field={field} onApplyRule={applyRule} />

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              aria-label={`Remove ${rule.label} filter`}
              onClick={() => removeRule(rule.field)}
            >
              <XIcon />
            </Button>
          </ButtonGroup>
        )
      })}
    </div>
  )
}
