const STEP_FORM_HEADINGS = [
  {
    title: "Let's create your store",
    subtitle: "Fill in your store details below.",
  },
  {
    title: "Now let's add your first branch",
    subtitle: "Fill in your store branch details below.",
  },
  {
    title: "Set up designations & salaries",
    subtitle: "These will be used to compute employee salaries.",
  },
  {
    title: "Build your team",
    subtitle: "Add or invite your employees.",
  },
  {
    title: "Build your team",
    subtitle: "Add or invite your employees.",
  },
]

export function StepFormHeading({ step }: { step: number }) {
  const heading = STEP_FORM_HEADINGS[step - 1]

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">Step {step}/5</p>
      <h3 className="text-2xl font-semibold">{heading.title}</h3>
      <p className="text-sm text-muted-foreground">{heading.subtitle}</p>
    </div>
  )
}
