import React from 'react';
import { Route, Switch } from 'react-router-dom';
import EmployeeSearch from '../../pages/EmployeeSearch';
import EmployeeInsert from '../../pages/EmployeeInsert';
import CustomerInsertNew from '../../pages/CustomerInsertNew';
import SalesInfo from '../../pages/SalesInfo'
import ManagementCompanyRegister from '../../pages/ManagementCompanyRegister'
import ManagementCompanySearch from '../../pages/ManagementCompanySearch'

const Routes = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.path}/`}
        component={EmployeeInsert}
      />
      <Route
        exact
        path={`${match.path}/employeeInsert`}
        component={EmployeeInsert}
      />
      <Route
        exact
        path={`${match.path}/customerInsertNew`}
        component={CustomerInsertNew}
      />
      <Route
        exact
        path={`${match.path}/employeeSearch`}
        component={EmployeeSearch}
      />
      <Route
        exact
        path={`${match.path}/salesInfo`}
        component={SalesInfo}
      />
      <Route
        exact
        path={`${match.path}/managementCompanyRegister`}
        component={ManagementCompanyRegister}
      />
      <Route
        exact
        path={`${match.path}/managementCompanySearch`}
        component={ManagementCompanySearch}
      />
    </Switch>
  );
};

export default Routes;
