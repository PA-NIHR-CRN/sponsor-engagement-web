var handlebars = require('handlebars/runtime')
var templates = {}
templates['assessment-reminder.html.hbs'] = handlebars.template({
  1: function (container, depth0, helpers, partials, data) {
    return '            <li>' + container.escapeExpression(container.lambda(depth0, depth0)) + '</li>\n'
  },
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var stack1,
      helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      "<html lang='en'>\n\n  <body>\n    <div>\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\n\n      <p style='font-size: 19px; font-weight:700; display: flex;'>\n        <img src='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'iconUrl') || (depth0 != null ? lookupProperty(depth0, 'iconUrl') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'iconUrl',
              hash: {},
              data: data,
              loc: { start: { line: 9, column: 18 }, end: { line: 9, column: 29 } },
            })
          : helper)
      ) +
      "' style='display:block; width: 35px; height: 35px;' />\n        <span style='margin-left: 10px; margin-top: 3px;'>There are one or more studies to assess</span>\n      </p>\n\n      <p>Hello,</p>\n\n      <p>You are a nominated contact for studies on the NIHR Research Delivery Network’s (RDN) research portfolio for:\n        <br />\n        <ul>\n" +
      ((stack1 = lookupProperty(helpers, 'each').call(
        alias1,
        depth0 != null ? lookupProperty(depth0, 'organisationNames') : depth0,
        {
          name: 'each',
          hash: {},
          fn: container.program(1, data, 0),
          inverse: container.noop,
          data: data,
          loc: { start: { line: 18, column: 10 }, end: { line: 20, column: 19 } },
        }
      )) != null
        ? stack1
        : '') +
      "        </ul>\n      </p>\n\n      <p>\n        One or more studies require an update. Please sign in to the Sponsor Engagement Tool to provide these updates.\n      </p>\n\n      <p>As a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor\n        Engagement Tool does not associate contacts to specific studies or groups of studies, only to the organisation.\n      </p>\n\n      <a\n        href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'signInLink') ||
            (depth0 != null ? lookupProperty(depth0, 'signInLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'signInLink',
              hash: {},
              data: data,
              loc: { start: { line: 33, column: 14 }, end: { line: 33, column: 28 } },
            })
          : helper)
      ) +
      "'\n        style='\n          box-sizing: border-box;\n          display: inline-block;\n          position: relative;\n          margin-top: 0;\n          margin-right: 0;\n          margin-left: 0;\n          margin-bottom: 22px;\n          padding: 8px 10px 7px;\n          border: 2px solid rgba(0, 0, 0, 0);\n          border-radius: 0;\n          color: #fff;\n          background-color: #00703c;\n          box-shadow: 0 2px 0 #002d18;\n          text-align: center;\n          vertical-align: top;\n          cursor: pointer;\n          -webkit-appearance: none;\n        '\n      >Sign in to assess studies</a>\n\n      <h2>Why am I being asked to assess studies?</h2>\n\n      <p>\n        The\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'rdnLink') || (depth0 != null ? lookupProperty(depth0, 'rdnLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'rdnLink',
              hash: {},
              data: data,
              loc: { start: { line: 59, column: 17 }, end: { line: 59, column: 28 } },
            })
          : helper)
      ) +
      "'>NIHR RDN</a>\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\n        and health and care organisations across England.\n      </p>\n\n      <p>\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\n        delegates on behalf of the Department of Health and Social Care (DHSC).\n      </p>\n\n      <p>The DHSC have published the\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 70, column: 17 }, end: { line: 70, column: 43 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>\n        , which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the\n        RDN.\n      </p>\n\n      <p>The Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements\n        outlined in the T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the\n        RDN holds on their organisation’s portfolio of studies, and to provide study data updates and assessments to\n        ensure the data held by the RDN is complete and up-to-date.\n      </p>\n\n      <p>Sponsors or their delegates are prompted to review and assess the progress of studies when:</p>\n\n      <ul>\n        <li>A study falls behind a planned milestone or</li>\n        <li>A study appears to not be recruiting to target</li>\n        <li>And the last study assessment is over three months old</li>\n      </ul>\n\n      <p>\n        Sponsors or their delegates can request\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'requestSupportLink') ||
            (depth0 != null ? lookupProperty(depth0, 'requestSupportLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'requestSupportLink',
              hash: {},
              data: data,
              loc: { start: { line: 91, column: 17 }, end: { line: 91, column: 39 } },
            })
          : helper)
      ) +
      "'>NIHR RDN support</a>\n        with study delivery and performance at any time.\n      </p>\n\n      <p>\n        <strong>\n          Please note that providing regular study updates and assessments are requirements of the\n          <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 98, column: 19 }, end: { line: 98, column: 45 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\n          result in removal from the NIHR RDN Portfolio.\n        </strong>\n      </p>\n\n      <h2>Nominate someone else to assess research studies</h2>\n\n      <p>\n        The NIHR RDN can give other people in your organisation access to this service. Contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\n        to add a new contact.\n      </p>\n\n      <hr />\n\n      <p>\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\n        removed from our list contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\n      </p>\n    </div>\n\n    <br />\n\n    <div>\n      <table style='width: 540px; border-collapse: collapse'>\n        <tbody>\n          <tr>\n            <td style='width: 162px'>\n              <p>\n                &nbsp;<img\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\n                  alt='NIHRLogo'\n                  width='206'\n                  class='CToWUd'\n                  data-bit='iit'\n                />\n              </p>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n\n      <p>\n        <a\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\n          target='_blank'\n        ><img\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\n            width='540'\n            height='101'\n            class='CToWUd'\n            data-bit='iit'\n          />\n        </a>\n      </p>\n\n      <p>\n        Follow us:\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\n          alt='FB Logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\n          alt='Twitter logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\n          alt='LI Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\n          alt='Youtube Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\n          alt='URL Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\n          target='_blank'\n        >nihr.ac.uk</a>\n      </p>\n      <br />\n      <br />\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\n        function and then permanently delete what you have received.\n      </p>\n    </div>\n  </body>\n\n</html>"
    )
  },
  useData: true,
})
templates['assessment-reminder.text.hbs'] = handlebars.template({
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      '# Assess progress of research studies in NIHR RDN portfolio\n\nThere are one or more studies to assess\n\nSign-in [' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'signInLink') ||
            (depth0 != null ? lookupProperty(depth0, 'signInLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'signInLink',
              hash: {},
              data: data,
              loc: { start: { line: 5, column: 9 }, end: { line: 5, column: 23 } },
            })
          : helper)
      ) +
      ']\n\nHello,\n\nYou are a nominated contact for ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationNames') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationNames') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationNames',
              hash: {},
              data: data,
              loc: { start: { line: 9, column: 32 }, end: { line: 9, column: 53 } },
            })
          : helper)
      ) +
      ' for studies on the NIHR Research Delivery Network’s (RDN) research portfolio. One\nor more studies require an update. Please sign in to the Sponsor Engagement Tool to provide these updates.\n\nAs a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor Engagement Tool\ndoes not associate contacts to specific studies or groups of studies, only to the organisation.\n\n# Why am I being asked to assess studies?\n\nThe NIHR RDN [' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'rdnLink') || (depth0 != null ? lookupProperty(depth0, 'rdnLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'rdnLink',
              hash: {},
              data: data,
              loc: { start: { line: 17, column: 14 }, end: { line: 17, column: 25 } },
            })
          : helper)
      ) +
      '] supports Sponsors and their delegates to deliver high-quality research, for the benefit of\npatients, the public and health and care organisations across England.\n\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates\non behalf of the Department of Health and Social Care (DHSC).\n\nThe DHSC have published the Terms and Conditions for NIHR RDN support [' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 23, column: 71 }, end: { line: 23, column: 97 } },
            })
          : helper)
      ) +
      '], which outlines \nthe requirements for Sponsors to provide up-to-date study data and assessments of progress to the RDN. \n\nThe Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements outlined in \nthe T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the RDN holds on their organisation’s portfolio of studies, \nand to provide study data updates and assessments to ensure the data held by the RDN is complete and up-to-date.\n\nSponsors or their delegates are prompted to review and assess the progress of studies when:\n\n- A study falls behind a planned milestone or\n- A study appears to not be recruiting to target\n- And the last study assessment is over three months old\n\nSponsors or their delegates can request NIHR RDN support with study delivery and performance at any time. [' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'requestSupportLink') ||
            (depth0 != null ? lookupProperty(depth0, 'requestSupportLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'requestSupportLink',
              hash: {},
              data: data,
              loc: { start: { line: 36, column: 107 }, end: { line: 36, column: 129 } },
            })
          : helper)
      ) +
      ']\n\nPlease note that providing regular study updates and assessments are requirements of the Terms and Conditions for NIHR RDN support\n[' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 39, column: 1 }, end: { line: 39, column: 27 } },
            })
          : helper)
      ) +
      ']. Failure to do so may result in removal from the NIHR RDN Portfolio.\n\n# Nominate someone else to assess research studies\n\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\na new contact.\n\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\nour list contact supportmystudy@nihr.ac.uk.'
    )
  },
  useData: true,
})
templates['contact-assigned.html.hbs'] = handlebars.template({
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      "<html lang='en'>\n\n  <body>\n    <div>\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\n\n      <p>Hello,</p>\n\n      <p>\n        You have been nominated as a contact for\n        " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 12, column: 8 }, end: { line: 12, column: 28 } },
            })
          : helper)
      ) +
      "\n        on the NIHR Research Delivery Network’s (RDN) research portfolio.\n      </p>\n\n      <p>\n        The\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'rdnLink') || (depth0 != null ? lookupProperty(depth0, 'rdnLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'rdnLink',
              hash: {},
              data: data,
              loc: { start: { line: 18, column: 17 }, end: { line: 18, column: 28 } },
            })
          : helper)
      ) +
      "'>NIHR RDN</a>\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\n        and health and care organisations across England.\n      </p>\n\n      <p>\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\n        delegates on behalf of the Department of Health and Social Care (DHSC).\n      </p>\n\n      <p>\n        The DHSC have published the\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 30, column: 17 }, end: { line: 30, column: 43 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>\n        , which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the\n        RDN.\n      </p>\n\n      <p>\n        The Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements\n        outlined in the T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the\n        RDN holds on their organisations portfolio of studies and to provide study data updates and assessments to ensure\n        the data held by the RDN is complete and up-to-date.\n      </p>\n\n      <p>\n        Please sign in to the Sponsor Engagement Tool to provide updates on studies.\n      </p>\n\n      <a\n        href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'signInLink') ||
            (depth0 != null ? lookupProperty(depth0, 'signInLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'signInLink',
              hash: {},
              data: data,
              loc: { start: { line: 47, column: 14 }, end: { line: 47, column: 28 } },
            })
          : helper)
      ) +
      "'\n        style='\n          box-sizing: border-box;\n          display: inline-block;\n          position: relative;\n          margin-top: 0;\n          margin-right: 0;\n          margin-left: 0;\n          margin-bottom: 22px;\n          padding: 8px 10px 7px;\n          border: 2px solid rgba(0, 0, 0, 0);\n          border-radius: 0;\n          color: #fff;\n          background-color: #00703c;\n          box-shadow: 0 2px 0 #002d18;\n          text-align: center;\n          vertical-align: top;\n          cursor: pointer;\n          -webkit-appearance: none;\n        '\n      >Sign in to assess studies</a>\n\n      <h2>Why am I being asked to assess studies?</h2>\n\n      <p>Sponsors or their delegates are asked to review and assess the progress of studies when:</p>\n\n      <ul>\n        <li>A study falls behind a planned milestone or</li>\n        <li> A study appears to not be recruiting to target</li>\n        <li> And the last study assessment is over three months old</li>\n      </ul>\n\n      <p>\n        Sponsors or their delegates can request\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'requestSupportLink') ||
            (depth0 != null ? lookupProperty(depth0, 'requestSupportLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'requestSupportLink',
              hash: {},
              data: data,
              loc: { start: { line: 81, column: 17 }, end: { line: 81, column: 39 } },
            })
          : helper)
      ) +
      "'>NIHR RDN support</a>\n        with study delivery and performance at any time.\n      </p>\n\n      <p>\n        <strong>\n          Please note that providing regular study data updates and assessments are requirements of the\n          <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 88, column: 19 }, end: { line: 88, column: 45 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\n          result in removal from the NIHR RDN Portfolio.\n        </strong>\n      </p>\n\n      <h2>Nominate someone else to assess studies</h2>\n\n      <p>\n        The NIHR RDN can give other people in your organisation access to this service. Contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\n        to add a new contact.\n      </p>\n\n      <hr />\n\n      <p>\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\n        removed from our list contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\n      </p>\n    </div>\n\n    <br />\n\n    <div>\n      <table style='width: 540px; border-collapse: collapse'>\n        <tbody>\n          <tr>\n            <td style='width: 162px'>\n              <p>\n                &nbsp;<img\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\n                  alt='NIHRLogo'\n                  width='206'\n                  class='CToWUd'\n                  data-bit='iit'\n                />\n              </p>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n\n      <p>\n        <a\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\n          target='_blank'\n        ><img\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\n            width='540'\n            height='101'\n            class='CToWUd'\n            data-bit='iit'\n          />\n        </a>\n      </p>\n\n      <p>\n        Follow us:\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\n          alt='FB Logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\n          alt='Twitter logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\n          alt='LI Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\n          alt='Youtube Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\n          alt='URL Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\n          target='_blank'\n        >nihr.ac.uk</a>\n      </p>\n      <br />\n      <br />\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\n        function and then permanently delete what you have received.\n      </p>\n    </div>\n  </body>\n\n</html>"
    )
  },
  useData: true,
})
templates['contact-assigned.text.hbs'] = handlebars.template({
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      '# NIHR RDN has invited you to assess the progress of your studies\n\nHello,\n\nYou have been nominated as a contact for ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 5, column: 41 }, end: { line: 5, column: 61 } },
            })
          : helper)
      ) +
      " studies on the NIHR Research Delivery Network's (RDN) research portfolio.\n\nThe NIHR RDN supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public and health and care organisations across England.\n\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates on behalf of the Department of Health and Social Care (DHSC).\n\nThe DHSC have published the Terms and Conditions for NIHR RDN support (" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 11, column: 71 }, end: { line: 11, column: 97 } },
            })
          : helper)
      ) +
      '), which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the RDN.\n\nThe Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements outlined in the T&Cs. \nSponsors and their delegates should use the Sponsor Engagement Tool to review the data the RDN holds on their organisations portfolio \nof studies and to provide study data updates and assessments to ensure the data held by the RDN is complete and up-to-date.\n\nPlease sign in to the Sponsor Engagement Tool to provide updates on studies. (' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'signInLink') ||
            (depth0 != null ? lookupProperty(depth0, 'signInLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'signInLink',
              hash: {},
              data: data,
              loc: { start: { line: 17, column: 78 }, end: { line: 17, column: 92 } },
            })
          : helper)
      ) +
      ')\n\n# Why am I being asked to assess studies?\n\nSponsors or their delegates are asked to review and assess the progress of studies when:\n\n- A study falls behind a planned milestone or\n- A study appears to not be recruiting to target\n- And the last study assessment is over three months old\n\nSponsors or their delegates can request NIHR RDN support with study delivery and performance at any time. (' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'requestSupportLink') ||
            (depth0 != null ? lookupProperty(depth0, 'requestSupportLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'requestSupportLink',
              hash: {},
              data: data,
              loc: { start: { line: 27, column: 107 }, end: { line: 27, column: 129 } },
            })
          : helper)
      ) +
      ')\n\nPlease note that providing regular study data updates and assessments are requirements of the Terms and Conditions for NIHR RDN support. \nFailure to do so may result in removal from the NIHR RDN Portfolio.(' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'termsAndConditionsLink') ||
            (depth0 != null ? lookupProperty(depth0, 'termsAndConditionsLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'termsAndConditionsLink',
              hash: {},
              data: data,
              loc: { start: { line: 30, column: 68 }, end: { line: 30, column: 94 } },
            })
          : helper)
      ) +
      ')\n\n# Nominate someone else to assess studies\n\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\na new contact.\n\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\nour list, please contact supportmystudy@nihr.ac.uk.\n'
    )
  },
  useData: true,
})
templates['contact-removed.html.hbs'] = handlebars.template({
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      "<html lang='en'>\n  <body>\n    <div>\n      <h1>NIHR RDN has removed you as a reviewer for " +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 5, column: 53 }, end: { line: 5, column: 73 } },
            })
          : helper)
      ) +
      '</h1>\n\n      <p>Hello,</p>\n\n      <p>You have been removed as a reviewer of research studies for\n        ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 10, column: 8 }, end: { line: 10, column: 28 } },
            })
          : helper)
      ) +
      ". You will no longer be able to review and assess study progress.\n      </p>\n\n      <hr />\n\n      <h2>Not sure why you've been removed?</h2>\n\n      <p>If you think there’s been an error please contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\n\n      <p>If you’re not sure why you’ve received this email or need to be removed from our list contact\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\n    </div>\n\n    <br />\n\n    <div>\n      <table style='width: 540px; border-collapse: collapse'>\n        <tbody>\n          <tr>\n            <td style='width: 162px'>\n              <p>\n                &nbsp;<img\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\n                  alt='NIHRLogo'\n                  width='206'\n                  class='CToWUd'\n                  data-bit='iit'\n                />\n              </p>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n\n      <p>\n        <a\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\n          target='_blank'\n        ><img\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\n            width='540'\n            height='101'\n            class='CToWUd'\n            data-bit='iit'\n          />\n        </a>\n      </p>\n\n      <p>\n        Follow us:\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\n          alt='FB Logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\n          alt='Twitter logo'\n          width='11'\n          height='11'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\n          alt='LI Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\n          alt='Youtube Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\n        |\n        <img\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\n          alt='URL Logo'\n          width='11'\n          height='9'\n          class='CToWUd'\n          data-bit='iit'\n        />\n        <a\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\n          target='_blank'\n        >nihr.ac.uk</a>\n      </p>\n      <br />\n      <br />\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\n        function and then permanently delete what you have received.\n      </p>\n    </div>\n  </body>\n\n</html>"
    )
  },
  useData: true,
})
templates['contact-removed.text.hbs'] = handlebars.template({
  compiler: [8, '>= 4.3.0'],
  main: function (container, depth0, helpers, partials, data) {
    var helper,
      alias1 = depth0 != null ? depth0 : container.nullContext || {},
      alias2 = container.hooks.helperMissing,
      alias3 = 'function',
      alias4 = container.escapeExpression,
      lookupProperty =
        container.lookupProperty ||
        function (parent, propertyName) {
          if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
            return parent[propertyName]
          }
          return undefined
        }

    return (
      '# NIHR RDN has removed you as a reviewer for ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 1, column: 45 }, end: { line: 1, column: 65 } },
            })
          : helper)
      ) +
      '\n\nHello, You have been removed as a reviewer of research studies for ' +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'organisationName') ||
            (depth0 != null ? lookupProperty(depth0, 'organisationName') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'organisationName',
              hash: {},
              data: data,
              loc: { start: { line: 3, column: 67 }, end: { line: 3, column: 87 } },
            })
          : helper)
      ) +
      ". You will no longer be able to\nreview and assess study progress.\n\n# Not sure why you've been removed?\n\nIf you think there’s been an error please contact supportmystudy@nihr.ac.uk.\n\nIf you’re not sure why you’ve received this email or need to be removed from our list contact supportmystudy@nihr.ac.uk."
    )
  },
  useData: true,
})
module.exports = templates