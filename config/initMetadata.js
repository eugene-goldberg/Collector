db.collections_metadata.update(
    {collectionName: "Cost_Source_Actuals"},
    {
        $set: {
            collectionName: "Cost_Source_Actuals",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
            );

db.collections_metadata.update(
    {collectionName: "Cost_Source_Budget"},
    {
        $set: {
            collectionName: "Cost_Source_Budget",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "Chart_of_Accounts"},
    {
        $set: {
            collectionName: "Chart_of_Accounts",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "Cost_Center_Master"},
    {
        $set: {
            collectionName: "Cost_Center_Master",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "Headcount_by_Department_Cost_Center_Labor"},
    {
        $set: {
            collectionName: "Headcount_by_Department_Cost_Center_Labor",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "Fixed_Asset_Register"},
    {
        $set: {
            collectionName: "Fixed_Asset_Register",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "AccountView_Inventory"},
    {
        $set: {
            collectionName: "AccountView_Inventory",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);


db.collections_metadata.update(
    {collectionName: "DC_Facilities"},
    {
    $set: {
        collectionName: "DC_Facilities",
        dataVersions: [],
        dataFields: []
    }
    },
    {upsert: true}
                            );



db.collections_metadata.update(
    {collectionName: "GL_accounts"},
    {
        $set: {
            collectionName: "GL_accounts",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);



db.collections_metadata.update(
    {collectionName: "NextGen_data"},
    {
        $set: {
            collectionName: "NextGen_data",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);

db.collections_metadata.update(
    {collectionName: "Profit_and_Loss_data"},
    {
        $set: {
            collectionName: "Profit_and_Loss_data",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);



db.collections_metadata.update(
    {collectionName: "Vendors"},
    {
        $set: {
            collectionName: "Vendors",
            dataVersions: [],
            dataFields: []
        }
    },
    {upsert: true}
);
