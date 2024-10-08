/*!
 * OpenUI5
 * (c) Copyright 2009-2024 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * @fileOverview Application component for OData V4 Data Aggregation.
 * @version @version@
 */
sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/Messaging",
	"sap/ui/core/UIComponent",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (MessageBox, Messaging, UIComponent, Filter, FilterOperator) {
	"use strict";

	return UIComponent.extend("sap.ui.core.sample.odata.v4.FlatDataAggregation.Component", {
		metadata : {
			interfaces : ["sap.ui.core.IAsyncContentCreation"],
			manifest : "json"
		},

		init : function () {
			var oMessageModel = Messaging.getMessageModel(),
				bMessageOpen = false;

			UIComponent.prototype.init.apply(this, arguments);

			this.oMessageModelBinding = oMessageModel.bindList("/", undefined,
				[], new Filter("technical", FilterOperator.EQ, true));

			this.oMessageModelBinding.attachChange(function (oEvent) {
				var aContexts = oEvent.getSource().getContexts(),
					aMessages = [],
					sPrefix;

				if (bMessageOpen || !aContexts.length) {
					return;
				}

				// Extract and remove the technical messages
				aContexts.forEach(function (oContext) {
					aMessages.push(oContext.getObject());
				});
				Messaging.removeMessages(aMessages);

				// Due to batching there can be more than one technical message. However the UX
				// guidelines say "display a single message in a message box" assuming that there
				// will be only one at a time.
				sPrefix = aMessages.length === 1 ? ""
					: "There have been multiple technical errors. One example: ";
				MessageBox.error(sPrefix + aMessages[0].message, {
					id : "serviceErrorMessageBox",
					onClose : function () {
						bMessageOpen = false;
					}
				});
				bMessageOpen = true;
			});
		}
	});
});
