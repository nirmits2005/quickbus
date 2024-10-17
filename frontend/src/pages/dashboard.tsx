import * as icon from '@mdi/js';
import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import type { ReactElement } from 'react';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/SectionMain';
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton';
import BaseIcon from '../components/BaseIcon';
import { getPageTitle } from '../config';
import Link from 'next/link';

import { useAppDispatch, useAppSelector } from '../stores/hooks';
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const iconsColor = useAppSelector((state) => state.style.iconsColor);
  const corners = useAppSelector((state) => state.style.corners);
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);

  const [users, setUsers] = React.useState('Loading...');

  const { isFetchingQuery } = useAppSelector((state) => state.openAi);

  async function loadData() {
    const entities = ['users'];
    const fns = [setUsers];

    const requests = entities.map((entity, index) => {
      return axios.get(`/${entity.toLowerCase()}/count`);
    });

    Promise.allSettled(requests).then((results) => {
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          fns[i](result.value.data.count);
        } else {
          fns[i](result.reason.message);
        }
      });
    });
  }

  React.useEffect(() => {
    loadData().then();
  }, []);

  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={icon.mdiChartTimelineVariant}
          title='Overview'
          main
        >
          {''}
        </SectionTitleLineWithButton>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'>
          <Link href={'/users/users-list'}>
            <div
              className={` ${
                corners !== 'rounded-full' ? corners : 'rounded-3xl'
              } dark:bg-dark-900 ${cardsStyle} dark:border-dark-700 p-6`}
            >
              <div className='flex justify-between align-center'>
                <div>
                  <div className='text-lg leading-tight   text-gray-500 dark:text-gray-400'>
                    Users
                  </div>
                  <div className='text-3xl leading-tight font-semibold'>
                    {users}
                  </div>
                </div>
                <div>
                  <BaseIcon
                    className={`${iconsColor}`}
                    w='w-16'
                    h='h-16'
                    size={48}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    path={icon.mdiAccountGroup || icon.mdiTable}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </SectionMain>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Dashboard;
