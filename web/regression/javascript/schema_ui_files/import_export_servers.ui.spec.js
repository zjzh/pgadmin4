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
import { messages } from '../fake_messages';
import SchemaView from '../../../pgadmin/static/js/SchemaView';
import ImportExportSelectionSchema from '../../../pgadmin/tools/import_export_servers/static/js/import_export_selection.ui';

describe('ImportExportServers', () => {
  let mount;
  let schemaObj = new ImportExportSelectionSchema();

  /* Use createMount so that material ui components gets the required context */
  /* https://material-ui.com/guides/testing/#api */
  beforeAll(() => {
    mount = createMount();
  });

  afterAll(() => {
    mount.cleanUp();
  });

  beforeEach(() => {
    jasmineEnzyme();
    /* messages used by validators */
    pgAdmin.Browser = pgAdmin.Browser || {};
    pgAdmin.Browser.messages = pgAdmin.Browser.messages || messages;
    pgAdmin.Browser.utils = pgAdmin.Browser.utils || {};
  });

  it('import', () => {
    mount(<SchemaView
      formType='dialog'
      schema={schemaObj}
      viewHelperProps={{
        mode: 'create',
      }}
      onDataChange={() => {/*This is intentional (SonarQube)*/}}
      showFooter={false}
      isTabView={false}
    />);
  });

  it('export', () => {
    let schemaObj = new ImportExportSelectionSchema(
      {imp_exp: 'e', filename: 'test.json'});
    mount(<SchemaView
      formType='dialog'
      schema={schemaObj}
      viewHelperProps={{
        mode: 'create',
      }}
      onDataChange={() => {/*This is intentional (SonarQube)*/}}
      showFooter={false}
      isTabView={false}
    />);
  });
});
