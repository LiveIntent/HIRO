<html>
<head>
...
    <script>
    // start liveintent module init and measurement v1.5.6
    const LI_REPORTING_KEY = "li-module-enabled";

    // Initialize ONE of the following values, but not both
    let LI_PUBLISHER_ID; // = your LiveIntent Publisher ID
    let LI_DISTRIBUTOR_ID; // = your LiveIntent Distributor ID (did-xxxx)

    // Initialize this value if the user is logged in
    let LOGGED_IN_USERS_EMAIL_OR_EMAIL_HASH; // = email or email hash of logged in user

    // Optionally initialize these values to share the users originating ip addresses
    let USERS_IPV4_ADDRESS; // = originating IPV4 address for the user
    let USERS_IPV6_ADDRESS; // = originating IPV6 address for the user

    const pbjs = (window.pbjs = window.pbjs || { que: [] });
    const googletag = (window.googletag = window.googletag || { cmd: [] });

    const TREATMENT_RATE = 0.95;
    if (window.liModuleEnabled === undefined) {
    // To manage the control group selection externally, override the initialization of
    this value
    // true = treated group, false = control group.
    window.liModuleEnabled = Math.random() < TREATMENT_RATE;
    window.liTreatmentRate = TREATMENT_RATE;
    }

    let auctionsEnriched = {};

    function setTargeting(enriched) {
      googletag.cmd.push(function () {
        let targeting = window.liModuleEnabled ? "t1" : "t0";
        if (enriched !== undefined) targeting += enriched ? "-e1" : "-e0";
        googletag.pubads().setTargeting(LI_REPORTING_KEY, targeting);
      });
    }

  setTargeting();

  pbjs.que.push(function () {
    // Enable the module, only if the visit is in the treated group
    if (window.liModuleEnabled) {
      pbjs.mergeConfig({
      userSync: {
      idPriority: {
        uid2: ['uid2', 'liveIntentID']
          },
      auctionDelay: 300,
      userIds: [
          {
            name: "liveIntentId",
            bidders: ['rubicon','bidswitch','vidazoo','sharethrough','pubmatic','ix','ttd',
            'grid','triplelift','zeta_global_ssp','medianet','openx'],
            params: {
                publisherId: LI_PUBLISHER_ID,
                distributorId: LI_DISTRIBUTOR_ID,
                emailHash: LOGGED_IN_USERS_EMAIL_OR_EMAIL_HASH,
                ipv4: USERS_IPV4_ADDRESS,
                ipv6: USERS_IPV6_ADDRESS,
                requestedAttributesOverrides: {
                    uid2: true,
                    bidswitch: true,
                    medianet: true,
                    magnite: true,
                    pubmatic: true,
                    index: true,
                    openx: true,
                    thetradedesk: true,
                    sovrn: true,
                    vidazoo: true,
                    sharethrough: true,
                    triplelift: true,
                    zetassp: true,
                    nexxen: true
                    },
            },
            storage: {
                type: "html5",
                name: "__tamLIResolveResult",
                expires: 1,
                },
            },
          ],
        },
      });
    }

    pbjs.refreshUserIds({ submoduleNames: [ "liveIntentId" ] })

    pbjs.onEvent("auctionInit", function (args) {
      auctionsEnriched[args.auctionId] =
        args.adUnits &&
        args.adUnits.some(
          (au) =>
            au.bids &&
            au.bids.some(
              (b) =>
                b.userIdAsEids &&
                b.userIdAsEids.some(
                  (eid) =>
                    eid.source === "liveintent.com" ||
                    (eid.uids &&
                      eid.uids.some(
                        (uid) =>
                          uid.ext && uid.ext.provider === "liveintent.com"
                      ))
                  )
             )
        );

     setTargeting(auctionsEnriched[args.auctionId]);
     });
   });

   // end liveintent module init and measurement

   </script>
</head>
<body> ... </body>
</html>

