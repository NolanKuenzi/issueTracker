import React from 'react';
import UserStores from './userStories';
import Examples from './examples';
import ApiTests from '../container/apiTests';
import Footer from './footer';

const Main = () => (
  <div>
    <h1>ISQA_4 - Issue Tracker</h1>
    <UserStores />
    <Examples />
    <ApiTests />
    <Footer />
  </div>
);

export default Main;
