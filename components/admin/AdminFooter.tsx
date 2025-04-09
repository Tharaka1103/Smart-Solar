export function AdminFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border border-border mt-auto mx-auto mb-4 w-1/2 rounded-xl shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              System Status: <span className="text-green-500">Healthy</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            © {currentYear} LUMINEX Admin Portal. All rights reserved.
          </div>

          <div className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  )
}