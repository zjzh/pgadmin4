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
import CompoundTriggerSchema from '../../../pgadmin/browser/server_groups/servers/databases/schemas/tables/compound_triggers/static/js/compound_trigger.ui';

describe('CompoundTriggerSchema', ()=>{
  let mount;
  let schemaObj = new CompoundTriggerSchema(
    {
      columns: [],
    },
    {
      schema: {},
      server: {user: {name:'enterprisedb', id:0}, server_type: 'ppas', version: 120000},
      table: {}
    }
  );
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

  it('validate', ()=>{
    let state = {};
    let setError = jasmine.createSpy('setError');

    state.evnt_truncate = false;
    state.evnt_delete = false;
    state.evnt_update = false;
    state.evnt_insert = false;
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('evnt_insert', 'Specify at least one event.');

    state.evnt_insert = true;
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('evnt_insert', null);
  });
});
