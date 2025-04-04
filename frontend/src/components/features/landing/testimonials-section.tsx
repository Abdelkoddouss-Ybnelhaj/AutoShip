interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

function Testimonial({ quote, author, role, avatar }: TestimonialProps) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          <img
            className="h-10 w-10 rounded-full"
            src={avatar || "/placeholder.svg"}
            alt={author}
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-slate-900 dark:text-white">
            {author}
          </h3>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {role}
          </div>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 italic">"{quote}"</p>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "DeployDash has completely transformed our deployment process. What used to take hours now takes minutes.",
      author: "Sarah Johnson",
      role: "CTO at TechStart",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      quote:
        "The one-click rollback feature has saved us countless times. It's like having an insurance policy for your deployments.",
      author: "Michael Chen",
      role: "Lead Developer at CodeCraft",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      quote:
        "Setting up our CI/CD pipeline with DeployDash was incredibly simple. The GitHub integration works flawlessly.",
      author: "Emma Rodriguez",
      role: "DevOps Engineer at CloudScale",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Loved by developers
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            See what our users have to say about DeployDash
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
