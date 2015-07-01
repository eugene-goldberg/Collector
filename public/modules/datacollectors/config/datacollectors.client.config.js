'use strict';

angular.module('datacollectors').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Data Management', 'datacollectors', 'dropdown', '/datacollectors(/create)?');
		Menus.addSubMenuItem('topbar', 'datacollectors', 'Update Salesforce Data', 'datacollectors',null,true,['sfupdate','admin']);
		Menus.addSubMenuItem('topbar', 'datacollectors', 'Update DC Data', 'dcupdate');
		Menus.addSubMenuItem('topbar', 'datacollectors', 'View Playcards', 'playcard');
		Menus.addSubMenuItem('topbar', 'datacollectors', 'Dashboard', 'dashboard');
		//Menus.addSubMenuItem('menuId','rootMenuItemUrl','menuItemTitle','menuItemUrl','menuItemUiRoute','isPublic','roles','position');
		//Menus.addSubMenuItem('topbar','datacollectors','Data Explorer','dataexplorer');
		//Menus.addSubMenuItem('topbar','datacollectors','Charts','charts');
		//Menus.addSubMenuItem('topbar', 'datacollectors', 'New Datacollector', 'datacollectors/create');
	}




]);
