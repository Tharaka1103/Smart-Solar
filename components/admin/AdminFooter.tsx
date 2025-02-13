export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} LUMINEX Admin Portal. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </button>
            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Support
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  )
}
