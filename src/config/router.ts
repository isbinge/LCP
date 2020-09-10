import React from 'react';
import { RouteProps, RedirectProps } from '@lib/react-router-dom';

// Pages
import AppDetail, { FormNotFoundOrSelected } from '@/pages/app/AppDetail';
import FormRecords from '@/pages/form/record/FormRecordList';
import Exception403 from '@/pages/exception/403';
import Exception404 from '@/pages/exception/404';
import HealthCheckFailed from '@/pages/exception/HealthCheckFailed';
import Landing from '@/pages/Landing';
import Organization from '@/pages/Organization';
import FormDesignerLayout from '@/layouts/FormDesignerLayout';

const routerConfig: RouteConfig[] = [
  {
    path: '/',
    component: Landing,
    noTokenRedeem: true,
    exact: true,
  },
  {
    path: '/home',
    name: 'Home',
    lazyComponent: () => import('@/pages/Home'),
  },
  {
    path: '/org/:orgId',
    name: 'Organization',
    component: Organization,
    routes: [
      {
        path: '/org/:orgId/dept/:deptId',
        name: 'Members',
        lazyComponent: () => import('@/pages/Organization/MemberMgmt'),
      },
    ],
  },
  {
    path: '/role',
    name: 'Role',
    routes: [
      {
        path: '/role/:orgId',
        lazyComponent: () => import('@/pages/Role'),
      },
    ],
  },
  {
    path: '/app',
    name: 'App',
    routes: [
      {
        path: '/app/:appId/form/:templateId/inst/:instanceId/*',
        name: 'Form Instance',
        routes: [
          {
            path: '/app/:appId/form/:templateId/inst/:instanceId/examine/:objectId',
            name: 'Examine a form record',
            lazyComponent: () => import('@/pages/form/record/collect/RecordExamine'),
          },
          {
            path: '/app/:appId/form/:templateId/inst/:instanceId/edit/:objectId',
            name: 'Update a form record',
            lazyComponent: () => import('@/pages/form/record/collect/RecordUpdate'),
          },
          {
            path: '/app/:appId/form/:templateId/inst/:instanceId/fillin',
            name: 'Fill in a form record',
            lazyComponent: () => import('@/pages/form/record/collect/RecordCreate'),
          },
        ],
      },
      {
        path: '/app/:appId/form-designer',
        name: 'Form Designer',
        component: FormDesignerLayout,
        routes: [
          {
            name: 'Record List Design',
            path: '/app/:appId/form-designer/:templateId/rl-design',
            lazyComponent: () => import('@/pages/form/designer/RecordListDesign'),
          },
          {
            name: 'Form Design',
            path: [
              '/app/:appId/form-designer/:templateId/form-design',
              '/app/:appId/form-designer/:templateId?',
            ],
            lazyComponent: () => import('@/pages/form/designer/FormTplDesign'),
          },
        ],
      },
      {
        path: '/app/:appId',
        name: 'App',
        component: AppDetail,
        routes: [
          {
            title: false,
            path: '/app/:appId/form/:templateId/inst/:instanceId',
            component: FormRecords,
          },
          {
            component: FormNotFoundOrSelected,
          },
        ],
      },
      {
        component: Exception404,
      },
    ],
  },
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    lazyComponent: () => import('@/pages/Questionnaire'),
  },
  {
    path: '/invitation',
    title: 'Invitation',
    noTokenRedeem: true,
    lazyComponent: () => import('@/pages/Organization/Invitation'),
  },
  {
    name: 'Unauthorized',
    path: '/403',
    noTokenRedeem: true,
    component: Exception403,
  },
  {
    name: 'Not found',
    path: '/404',
    noTokenRedeem: true,
    component: Exception404,
  },
  {
    name: 'Service unavailable',
    path: '/oops',
    noTokenRedeem: true,
    component: HealthCheckFailed,
  },
  {
    component: Exception404,
  },
];

// type UserRole = 'admin' | 'user' | 'guest' | 'NULL';

interface CompatibleRouteConfigBase
  extends Omit<RouteProps, 'component'>,
    Partial<Omit<RedirectProps, 'path'>> {}

export interface RouteConfig extends CompatibleRouteConfigBase {
  /** Specify route name  */
  name?: string;
  /** Route title  */
  title?: false | string | { defaultTitle: string; id: string };
  /** Sub routes for layout route or simply organizing */
  routes?: RouteConfig[];
  /**
   * `isLazy` is deprecated.
   *
   * Directly pass dynamic import function here
   * to enable route splitting
   */
  lazyComponent?: () => Promise<{ default: React.ComponentType<unknown> }>;
  fallback?: React.ReactNode;
  /** Redirecting route */
  redirect?: RedirectProps;
  /** Component to render */
  component?: React.ComponentType<unknown>;
  /** Accepting roles */
  // auths?: UserRole[];
  /** Redirecting if not match the auths */
  // authNoMatchRedirect?: string;
  /** Render if not match the auths */
  // authNoMatchRender?: React.ComponentType<unknown>;
  /** If to carry token for authorization */
  noTokenRedeem?: boolean;
}

export default routerConfig;
