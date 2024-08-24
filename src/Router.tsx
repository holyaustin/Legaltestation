import NotFound from '@/pages/404';
import { createBrowserRouter, redirect, RouteObject, RouterProvider } from 'react-router-dom';

const routerConfig: RouteObject[] = [
  {
    path: '/',
    async lazy() {
      const Page = await import('@/App.tsx');
      return { Component: Page.default };
    },
    children: [
      {
        path: '',
        async lazy() {
          const Page = await import('@/pages/Home');
          return { Component: Page.default };
        },
        children: [
          {
            path: '',
            loader: () => {
              const search = location.search;

              return redirect('/lucky-wheel' + search);
            }
          },
          {
            path: '/lucky-wheel',
            async lazy() {
              const Page = await import('@/pages/LuckyWheel');
              return { Component: Page.default };
            }
          },
          {
            path: '/rank',
            async lazy() {
              const Page = await import('@/pages/Rank');
              return { Component: Page.default };
            }
          },
          {
            path: '/tasks',
            async lazy() {
              const Page = await import('@/pages/Tasks');
              return { Component: Page.default };
            }
          },
          {
            path: '/rewards',
            async lazy() {
              const Page = await import('@/pages/Rewards');
              return { Component: Page.default };
            }
          }
        ]
      },
      {
        path: '/attest',
        async lazy() {
          const Page = await import('@/pages/Attest');
          return { Component: Page.default };
        }
      },
      {
        path: '/records',
        async lazy() {
          const Page = await import('@/pages/Records');
          return { Component: Page.default };
        }
      },
      {
        path: '/schema',
        async lazy() {
          const Page = await import('@/pages/CreateSchema');
          return { Component: Page.default };
        }
      },
      {
        path: '/quizzes',
        async lazy() {
          const Page = await import('@/pages/Quizzes');
          return { Component: Page.default };
        }
      },
      {
        path: '/invite-friends',
        async lazy() {
          const Page = await import('@/pages/InviteFriends');
          return { Component: Page.default };
        }
      },
      {
        path: '/tickets',
        async lazy() {
          const Page = await import('@/pages/Tickets');
          return { Component: Page.default };
        }
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];

const router = createBrowserRouter(routerConfig);

export const Router = () => {
  return <RouterProvider router={router} />;
};
