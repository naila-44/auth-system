export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6">
        <p className="text-sm">
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-3 sm:mt-0">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
