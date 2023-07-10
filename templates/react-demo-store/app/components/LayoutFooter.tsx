import Link from "next/link";
import {
  getTranslatedProperty,
  getCategoryRoute,
} from "@shopware-pwa/helpers-next";

export default function LayoutFooter({ menu }) {
  return (
    <footer className="px-4 sm:px-6 mt-2 lg:mt-8">
      <menu className="border-t-2 border-gray-100 flex justify-center">
        <div className="py-10 w-full max-w-screen-xl grid grid-cols-2 md:grid-cols-4">
          <div className="hidden md:block">
            <Link href="/">
              <span className="sr-only">Shopware</span>
              <img className="h-15 w-auto sm:h-15" src="/logo.svg" alt="Logo" />
            </Link>
          </div>

          {menu.map((navigationElement) => {
            return (
              <div key={navigationElement.id}>
                <h4 className="mb-5">
                  {getTranslatedProperty(navigationElement, "name")}
                </h4>
                {navigationElement.childCount > 0 && (
                  <ul className="list-none p-0 mb-5">
                    {navigationElement.children.map((navigationChild) => {
                      return (
                        <li className="pb-3 md:pb-1" key={navigationChild.id}>
                          <Link
                            target="{
                              navigationChild.externalLink || navigationChild.linkNewTab
                                ? '_blank'
                                : ''
                            }"
                            href="getCategoryRoute(navigationChild)"
                            className="text-base font-normal text-gray-500 hover:text-gray-900"
                          >
                            {getTranslatedProperty(navigationChild, "name")}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
          <div className="hidden md:block">
            <ul className="list-none">
              <li className="pb-1">
                <a
                  href="mailto:info@shopware.com"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  info@shopware.com
                </a>
              </li>
              <li className="pb-1">
                <a
                  href="tel:0080074676260"
                  className="text-base font-medium text-gray-500 hover:text-gray-900"
                >
                  Worldwide: 00 800 746 7626 0
                </a>
              </li>
            </ul>
          </div>
        </div>
      </menu>
    </footer>
  );
}
