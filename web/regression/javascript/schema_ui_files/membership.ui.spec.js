/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2022, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import jasmineEnzyme from 'jasmine-enzyme';
import React from 'react';
import '../helper/enzyme.helper';
import { createMount } from '@material-ui/core/test-utils';
import pgAdmin from 'sources/pgadmin';
import {messages} from '../fake_messages';
import SchemaView from '../../../pgadmin/static/js/SchemaView';
import MembershipSchema from '../../../pgadmin/browser/server_groups/servers/static/js/membership.ui';
import * as nodeAjax from '../../../pgadmin/browser/static/js/node_ajax';
import BaseUISchema from '../../../pgadmin/static/js/SchemaView/base_schema.ui';

class SchemaInColl extends BaseUISchema {
  constructor(schemaObj) {
    super();
    this.schemaObj = schemaObj;
  }

  get baseFields() {
    return [{
      id: 'collection', label: '', type: 'collection',
      schema: this.schemaObj,
      editable: false,
      canAdd: true, canEdit: false, canDelete: true, hasRole: true,
    }];
  }
}

describe('MembershipSchema', ()=>{
  let mount;
  let schemaObj = new MembershipSchema(
    ()=>[]);
  let getInitData = ()=>Promise.resolve({});

  /* Use createMount so that material ui components gets the required context */
  /* https://material-ui.com/guides/testing/#api */
  beforeAll(()=>{
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(()=>{
    jasmineEnzyme();
    /* messages used by validators */
    pgAdmin.Browser = pgAdmin.Browser || {};
    pgAdmin.Browser.messages = pgAdmin.Browser.messages || messages;
    pgAdmin.Browser.utils = pgAdmin.Browser.utils || {};
    pgAdmin.Browser.utils.support_ssh_tunnel = true;
  });

  it('create', ()=>{
    mount(<SchemaView
      formType='dialog'
      schema={schemaObj}
      viewHelperProps={{
        mode: 'create',
      }}
      onSave={()=>{/*This is intentional (SonarQube)*/}}
      onClose={()=>{/*This is intentional (SonarQube)*/}}
      onHelp={()=>{/*This is intentional (SonarQube)*/}}
      onEdit={()=>{/*This is intentional (SonarQube)*/}}
      onDataChange={()=>{/*This is intentional (SonarQube)*/}}
      confirmOnCloseReset={false}
      hasSQL={false}
      disableSqlHelp={false}
      disableDialogHelp={false}
    />);
  });

  it('edit', ()=>{
    mount(<SchemaView
      formType='dialog'
      schema={schemaObj}
      getInitData={getInitData}
      viewHelperProps={{
        mode: 'edit',
      }}
      onSave={()=>{/*This is intentional (SonarQube)*/}}
      onClose={()=>{/*This is intentional (SonarQube)*/}}
      onHelp={()=>{/*This is intentional (SonarQube)*/}}
      onEdit={()=>{/*This is intentional (SonarQube)*/}}
      onDataChange={()=>{/*This is intentional (SonarQube)*/}}
      confirmOnCloseReset={false}
      hasSQL={false}
      disableSqlHelp={false}
      disableDialogHelp={false}
    />);
  });

  it('properties', ()=>{
    mount(<SchemaView
      formType='tab'
      schema={schemaObj}
      getInitData={getInitData}
      viewHelperProps={{
        mode: 'properties',
      }}
      onHelp={()=>{/*This is intentional (SonarQube)*/}}
      onEdit={()=>{/*This is intentional (SonarQube)*/}}
    />);
  });

  it('MembershipMemberSchema', ()=>{
    spyOn(nodeAjax, 'getNodeListByName').and.returnValue([]);
    let ctrl = mount(<SchemaView
      formType='dialog'
      schema={new SchemaInColl(schemaObj)}
      viewHelperProps={{
        mode: 'create',
      }}
      onSave={()=>{/*This is intentional (SonarQube)*/}}
      onClose={()=>{/*This is intentional (SonarQube)*/}}
      onHelp={()=>{/*This is intentional (SonarQube)*/}}
      onEdit={()=>{/*This is intentional (SonarQube)*/}}
      onDataChange={()=>{/*This is intentional (SonarQube)*/}}
      confirmOnCloseReset={false}
      hasSQL={false}
      disableSqlHelp={false}
      disableDialogHelp={false}
    />);
    /* Make sure you hit every corner */
    ctrl.find('DataGridView').at(0).find('PgIconButton[data-test="add-row"]').find('button').simulate('click');
  });
});
