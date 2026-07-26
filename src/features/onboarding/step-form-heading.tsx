const STEP_FORM_HEADINGS = [
  {
    title: "Tell us about your business",
    subtitle:
      "Your store is the main workspace where you'll manage everything.",
  },
  {
    title: "What kind of business do you run?",
    subtitle: "Choose the option that best describes {{store_name}}.",
  },
  {
    title: "Now let's add your first branch",
    subtitle:
      "Employees will clock in and out at these branches. Start with one — you can always add more later.",
  },
  {
    title: "Set up designations & salaries",
    subtitle:
      "Define roles and their salary rates. These will be used to calculate employee salaries automatically.",
  },
  {
    title: "Add your employees",
    subtitle: "Assign each employee to a designation and a branch.",
  },
  {
    title: "Build your team",
    subtitle: "Add or invite your employees.",
  },
]

export function StepFormHeading({
  step,
  storeName,
}: {
  step: number
  storeName?: string
}) {
  const heading = STEP_FORM_HEADINGS[step - 1]

  return (
    <div className="space-y-1">
      <div className="mb-5 flex items-center gap-1">
        {Array.from(Array(STEP_FORM_HEADINGS.length).keys()).map((n) => (
          <span
            key={`step-${n + 1}`}
            data-active={step === n + 1}
            className="block h-1.5 w-5 rounded-full bg-primary/30 data-active:bg-primary"
          />
        ))}
      </div>
      <h3 className="text-2xl font-semibold">{heading.title}</h3>
      <p className="text-sm text-muted-foreground">
        {heading.subtitle.replaceAll("{{store_name}}", storeName ?? "")}
      </p>
    </div>
  )
}
