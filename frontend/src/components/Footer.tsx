import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-9 h-9" viewBox="0 0 44 44" aria-hidden="true">
                <rect width="44" height="44" rx="12" fill="#1b3a6b" />
                <path
                  d="M12 24 L22 14 L32 24 M16 22 V32 H28 V22"
                  fill="none"
                  stroke="#ff8a65"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xl font-extrabold text-white">RealEstate</span>
            </div>
            <p className="text-sm text-gray-400">
              Find your dream property from thousands of listings across Pakistan.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-white transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-gray-400">Apartments</span></li>
              <li><span className="text-gray-400">Houses</span></li>
              <li><span className="text-gray-400">Villas</span></li>
              <li><span className="text-gray-400">Plots</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">For Agents and Owners</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create an Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new" className="hover:text-white transition-colors">
                  Post a Property
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}