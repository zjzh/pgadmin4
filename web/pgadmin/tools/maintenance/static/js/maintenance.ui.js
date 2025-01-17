/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2022, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import BaseUISchema from 'sources/SchemaView/base_schema.ui';
import gettext from 'sources/gettext';

export class VacuumSchema extends BaseUISchema {
  constructor(fieldOptions={}) {
    super();

    this.fieldOptions = {
      ...fieldOptions,
    };
  }

  get idAttribute() {
    return 'op';
  }


  get baseFields() {
    return  [{
      id: 'vacuum_full',
      group: gettext('Vacuum'),
      disabled: function(state) {
        if(state?.op) {
          return (state.op != 'VACUUM');
        } else {
          return false;
        }
      },
      type: 'switch',
      label: gettext('FULL'),
      deps: ['op'],
    }, {
      id: 'vacuum_freeze',
      deps: ['op'],
      disabled: function(state) {
        if(state?.op) {
          return (state.op != 'VACUUM');
        } else {
          return false;
        }
      },
      type: 'switch',
      label: gettext('FREEZE'),
      group: gettext('Vacuum'),
    }, {
      id: 'vacuum_analyze',
      deps: ['op'],
      type: 'switch',
      disabled: function(state) {
        if(state?.op) {
          return (state.op != 'VACUUM');
        } else {
          return false;
        }
      },
      label: gettext('ANALYZE'),
      group: gettext('Vacuum'),
    }];
  }
}

export function getVacuumSchema(fieldOptions) {
  return new VacuumSchema(fieldOptions);
}


//Maintenance Schema
export default class MaintenanceSchema extends BaseUISchema {

  constructor(getVacuumSchema, fieldOptions = {}) {
    super({
      op: 'VACUUM',
      verbose: true,
      vacuum_full: false,
      vacuum_freeze: false,
      vacuum_analyze: false,
    });

    this.fieldOptions = {
      nodeInfo: null,
      ...fieldOptions,
    };

    this.getVacuumSchema = getVacuumSchema;
    this.nodeInfo = fieldOptions.nodeInfo;
  }

  get idAttribute() {
    return 'id';
  }

  get baseFields() {
    var obj = this;
    return [
      {
        id: 'op',
        label: gettext('Maintenance operation'),
        type: 'toggle',
        group: gettext('Options'),
        options: [
          {
            'label': gettext('VACUUM'),
            value: 'VACUUM',
          },
          {
            'label': gettext('ANALYZE'),
            value: 'ANALYZE',
          },
          {
            'label': gettext('REINDEX'),
            value: 'REINDEX',
          },
          {
            'label': gettext('CLUSTER'),
            value: 'CLUSTER',
          },
        ],
      },
      {
        type: 'nested-fieldset',
        label: gettext('Type of objects'),
        schema: obj.getVacuumSchema(),
        group: gettext('Options'),
      },
      {
        id: 'verbose',
        group: gettext('Options'),
        deps: ['op'],
        type: 'switch',
        label: gettext('Verbose Messages'),
        disabled: function(state) {
          var nodeInfo = this.nodeInfo;
          if(state?.verbose) {
            if ('primary_key' in nodeInfo || 'unique_constraint' in nodeInfo ||
            'index' in nodeInfo) {
              if (state.op == 'REINDEX') {
                state.verbose = false;
                return true;
              }
            }
            return state.op == 'REINDEX';
          } else {
            return false;
          }
        },
      },
    ];
  }
}
