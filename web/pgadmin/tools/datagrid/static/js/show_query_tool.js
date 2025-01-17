/////////////////////////////////////////////////////////////
//
// pgAdmin 4 - PostgreSQL Tools
//
// Copyright (C) 2013 - 2022, The pgAdmin Development Team
// This software is released under the PostgreSQL Licence
//
//////////////////////////////////////////////////////////////

import gettext from '../../../../static/js/gettext';
import url_for from '../../../../static/js/url_for';
import {getPanelTitle} from './datagrid_panel_title';
import {getRandomInt} from 'sources/utils';
import $ from 'jquery';
import Notify from '../../../../static/js/helpers/Notifier';

function hasDatabaseInformation(parentData) {
  return parentData.database;
}

function generateUrl(trans_id, title, parentData, sqlId) {
  let url_endpoint = url_for('datagrid.panel', {
    'trans_id': trans_id,
  });

  url_endpoint += `?is_query_tool=${true}`
    +`&sgid=${parentData.server_group._id}`
    +`&sid=${parentData.server._id}`
    +`&server_type=${parentData.server.server_type}`;

  if (hasDatabaseInformation(parentData)) {
    url_endpoint += `&did=${parentData.database._id}`;
  }

  if(sqlId) {
    url_endpoint += `&sql_id=${sqlId}`;
  }

  return url_endpoint;
}

function hasServerInformations(parentData) {
  return parentData.server === undefined;
}

function generateTitle(pgBrowser, aciTreeIdentifier) {
  return getPanelTitle(pgBrowser, aciTreeIdentifier);
}

export function showQueryTool(datagrid, pgBrowser, url, aciTreeIdentifier, transId) {
  const sURL = url || '';
  const queryToolTitle = generateTitle(pgBrowser, aciTreeIdentifier);

  const currentNode = pgBrowser.tree.findNodeByDomElement(aciTreeIdentifier);
  if (currentNode === undefined) {
    Notify.alert(
      gettext('Query Tool Error'),
      gettext('No object selected.')
    );
    return;
  }

  const parentData = pgBrowser.tree.getTreeNodeHierarchy(currentNode);

  if (hasServerInformations(parentData)) {
    return;
  }

  const gridUrl = generateUrl(transId, queryToolTitle, parentData);
  launchDataGrid(datagrid, transId, gridUrl, queryToolTitle, sURL);
}

export function generateScript(parentData, datagrid) {
  const queryToolTitle = `${parentData.database}/${parentData.user}@${parentData.server}`;
  const transId = getRandomInt(1, 9999999);

  let url_endpoint = url_for('datagrid.panel', {
    'trans_id': transId,
  });

  url_endpoint += `?is_query_tool=${true}`
    +`&sgid=${parentData.sgid}`
    +`&sid=${parentData.sid}`
    +`&server_type=${parentData.stype}`
    +`&did=${parentData.did}`;

  launchDataGrid(datagrid, transId, url_endpoint, queryToolTitle, '');
}

export function showERDSqlTool(parentData, erdSqlId, queryToolTitle, datagrid) {
  const transId = getRandomInt(1, 9999999);
  parentData = {
    server_group: {
      _id: parentData.sgid,
    },
    server: {
      _id: parentData.sid,
      server_type: parentData.stype,
    },
    database: {
      _id: parentData.did,
    },
  };

  const gridUrl = generateUrl(transId, queryToolTitle, parentData, erdSqlId);
  launchDataGrid(datagrid, transId, gridUrl, queryToolTitle, '');
}

export function launchDataGrid(datagrid, transId, gridUrl, queryToolTitle, sURL) {
  let retVal = datagrid.launch_grid(transId, gridUrl, true, queryToolTitle, sURL);

  if(!retVal) {
    Notify.alert(
      gettext('Query tool launch error'),
      gettext(
        'Please allow pop-ups for this site to perform the desired action. If the main window of pgAdmin is closed then close this window and open a new pgAdmin session.'
      )
    );
  }
}

export function _set_dynamic_tab(pgBrowser, value){
  var datagrid_panels = pgBrowser.docker.findPanels('frm_datagrid');
  datagrid_panels.forEach(panel => {
    if(value) {
      $('#' + panel.$title.index() + ' div:first').addClass('wcPanelTab-dynamic');
    } else {
      $('#' + panel.$title.index() + ' div:first').removeClass('wcPanelTab-dynamic');
    }
  });

  var debugger_panels = pgBrowser.docker.findPanels('frm_debugger');
  debugger_panels.forEach(panel => {
    if(value) {
      $('#' + panel.$title.index() + ' div:first').addClass('wcPanelTab-dynamic');
    } else {
      $('#' + panel.$title.index() + ' div:first').removeClass('wcPanelTab-dynamic');
    }
  });

}
