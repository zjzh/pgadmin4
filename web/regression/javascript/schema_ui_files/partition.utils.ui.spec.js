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
import BaseUISchema from '../../../pgadmin/static/js/SchemaView/base_schema.ui';
import _ from 'lodash';
import * as nodeAjax from '../../../pgadmin/browser/static/js/node_ajax';
import { PartitionKeysSchema, PartitionsSchema } from '../../../pgadmin/browser/server_groups/servers/databases/schemas/tables/static/js/partition.utils.ui';

function getFieldDepChange(schema, id) {
  return _.find(schema.fields, (f)=>f.id==id)?.depChange;
}

class SchemaInColl extends BaseUISchema {
  constructor(schemaObj, columns) {
    super();
    this.collSchema = schemaObj;
    this.columns = columns;
  }
  getCollations() {/*This is intentional (SonarQube)*/}
  getOperatorClass() {/*This is intentional (SonarQube)*/}

  get baseFields() {
    return [{
      id: 'collection', label: '', type: 'collection',
      schema: this.collSchema,
      editable: false,
      canAdd: true, canEdit: false, canDelete: true, hasRole: true,
      columns : this.columns,
    }];
  }
}

describe('PartitionKeysSchema', ()=>{
  let mount;
  let schemaObj;
  let getInitData = ()=>Promise.resolve({});

  /* Use createMount so that material ui components gets the required context */
  /* https://material-ui.com/guides/testing/#api */
  beforeAll(()=>{
    mount = createMount();
    spyOn(nodeAjax, 'getNodeAjaxOptions').and.returnValue(Promise.resolve([]));
    spyOn(nodeAjax, 'getNodeListByName').and.returnValue(Promise.resolve([]));
    let partitionObj =  new PartitionKeysSchema();
    schemaObj = new SchemaInColl(partitionObj);
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
    let ctrl = mount(<SchemaView
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

    /* Make sure you hit every corner */
    ctrl.find('DataGridView').at(0).find('PgIconButton[data-test="add-row"]').find('button').simulate('click');

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

  it('depChange', ()=>{
    let state = {};

    state.key_type = 'expression';
    expect(getFieldDepChange(schemaObj.collSchema, 'pt_column')(state, [], null, {})).toEqual({
      pt_column: undefined,
    });

    state.key_type = 'column';
    expect(getFieldDepChange(schemaObj.collSchema, 'expression')(state, [], null, {})).toEqual({
      expression: undefined,
    });
  });

  it('validate', ()=>{
    let state = {};
    let setError = jasmine.createSpy('setError');

    state.key_type = 'expression';
    schemaObj.collSchema.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('expression', '\'Partition key expression\' cannot be empty.');

    state.expression = 'abc';
    expect(schemaObj.collSchema.validate(state, setError)).toBe(false);
  });
});


describe('PartitionsSchema', ()=>{
  let mount;
  let schemaObj;
  let getInitData = ()=>Promise.resolve({});

  /* Use createMount so that material ui components gets the required context */
  /* https://material-ui.com/guides/testing/#api */
  beforeAll(()=>{
    mount = createMount();
    spyOn(nodeAjax, 'getNodeAjaxOptions').and.returnValue(Promise.resolve([]));
    spyOn(nodeAjax, 'getNodeListByName').and.returnValue(Promise.resolve([]));
    schemaObj = new PartitionsSchema();
    schemaObj.top = schemaObj;
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

  it('create collection', ()=>{
    let schemaCollObj = new SchemaInColl(
      schemaObj,[ 'is_attach', 'partition_name', 'is_default', 'values_from', 'values_to', 'values_in', 'values_modulus', 'values_remainder']
    );
    let ctrl = mount(<SchemaView
      formType='dialog'
      schema={schemaCollObj}
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


  it('depChange', ()=>{
    let state = {};

    state.is_attach = true;
    expect(getFieldDepChange(schemaObj, 'is_sub_partitioned')(state)).toEqual({
      is_sub_partitioned: false,
    });
  });

  it('validate', ()=>{
    let state = {is_sub_partitioned: true};
    let setError = jasmine.createSpy('setError');

    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('sub_partition_keys', 'Please specify at least one key for partitioned table.');

    state.is_sub_partitioned = false;
    state.is_default = false;
    schemaObj.top._sessData = {
      partition_type: 'range',
    };
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('values_from', 'For range partition From field cannot be empty.');

    state.values_from = 1;
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('values_to', 'For range partition To field cannot be empty.');

    schemaObj.top._sessData.partition_type = 'list';
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('values_in', 'For list partition In field cannot be empty.');

    schemaObj.top._sessData.partition_type = 'hash';
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('values_modulus', 'For hash partition Modulus field cannot be empty.');

    state.values_modulus = 1;
    schemaObj.validate(state, setError);
    expect(setError).toHaveBeenCalledWith('values_remainder', 'For hash partition Remainder field cannot be empty.');
  });
});

