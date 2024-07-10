var handlebars = require('handlebars/runtime')
var templates = {}
templates['assessment-reminder.html.hbs'] = handlebars.template({
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
      "<html lang='en'>\r\n\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\r\n\r\n      <p style='font-size: 19px; font-weight:700; display: flex;'>\r\n        <img src='" +
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
      "' style='display:block; width: 35px; height: 35px;' />\r\n        <span style='margin-left: 10px; margin-top: 3px;'>There are one or more studies to assess</span>\r\n      </p>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>You are nominated as a Sponsor contact for studies on the NIHR Research Delivery Network’s (RDN) research\r\n        portfolio. One or more studies require an update on their status. Please sign in to the Sponsor Engagement Tool\r\n        to provide these updates.</p>\r\n\r\n      <p>As a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor\r\n        Engagement Tool does not associate contacts to specific studies or groups of studies, only to the organisation.</p>\r\n\r\n      <a\r\n        href='" +
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
              loc: { start: { line: 23, column: 14 }, end: { line: 23, column: 28 } },
            })
          : helper)
      ) +
      "'\r\n        style='\r\n          box-sizing: border-box;\r\n          display: inline-block;\r\n          position: relative;\r\n          margin-top: 0;\r\n          margin-right: 0;\r\n          margin-left: 0;\r\n          margin-bottom: 22px;\r\n          padding: 8px 10px 7px;\r\n          border: 2px solid rgba(0, 0, 0, 0);\r\n          border-radius: 0;\r\n          color: #fff;\r\n          background-color: #00703c;\r\n          box-shadow: 0 2px 0 #002d18;\r\n          text-align: center;\r\n          vertical-align: top;\r\n          cursor: pointer;\r\n          -webkit-appearance: none;\r\n        '\r\n      >Sign in to assess studies</a>\r\n\r\n      <h2>Why am I being asked to assess studies?</h2>\r\n\r\n      <p>\r\n        The\r\n        <a href='" +
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
              loc: { start: { line: 49, column: 17 }, end: { line: 49, column: 28 } },
            })
          : helper)
      ) +
      "'>NIHR RDN</a>\r\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\r\n        and health and care organisations across England.\r\n      </p>\r\n\r\n      <p>\r\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\r\n        delegates on behalf of the Department of Health and Social Care.\r\n      </p>\r\n\r\n      <p>Sponsors or their delegates are asked to review and assess the progress of studies when:</p>\r\n\r\n      <ul>\r\n        <li>A study falls behind the agreed milestones or</li>\r\n        <li>A study is not recruiting to target</li>\r\n        <li>And the last progress assessment is over three months old</li>\r\n      </ul>\r\n\r\n      <p>\r\n        Sponsors or their delegates can request\r\n        <a href='" +
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
              loc: { start: { line: 69, column: 17 }, end: { line: 69, column: 39 } },
            })
          : helper)
      ) +
      "'>NIHR RDN support</a>\r\n        with their research study at any time.\r\n      </p>\r\n\r\n      <p>\r\n        <strong>\r\n          Please note that providing regular study assessments is a requirement of the\r\n          <a href='" +
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
              loc: { start: { line: 76, column: 19 }, end: { line: 76, column: 45 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\r\n          result in removal from the NIHR RDN Portfolio.\r\n        </strong>\r\n      </p>\r\n\r\n      <h2>Nominate someone else to assess research studies</h2>\r\n\r\n      <p>\r\n        The NIHR RDN can give other people in your organisation access to this service. Contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\r\n        to add a new contact.\r\n      </p>\r\n\r\n      <hr />\r\n\r\n      <p>\r\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\r\n        removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\r\n      </p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>"
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
      '# Assess progress of research studies in NIHR RDN portfolio\r\n\r\nThere are one or more studies to assess\r\n\r\nSign-in [' +
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
      ']\r\n\r\nHello,\r\n\r\nYou are nominated as a Sponsor contact for studies on the NIHR Research Delivery Network’s (RDN) research portfolio. One\r\nor more studies require an update on their status. Please sign in to the Sponsor Engagement Tool to provide these\r\nupdates.\r\n\r\nAs a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor Engagement Tool\r\ndoes not associate contacts to specific studies or groups of studies, only to the organisation.\r\n\r\n# Why am I being asked to assess studies?\r\n\r\nThe NIHR RDN [' +
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
              loc: { start: { line: 18, column: 14 }, end: { line: 18, column: 25 } },
            })
          : helper)
      ) +
      '] supports Sponsors and their delegates to deliver high-quality research, for the benefit of\r\npatients, the public and health and care organisations across England.\r\n\r\n\r\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates\r\non behalf of the Department of Health and Social Care.\r\n\r\nSponsors or their delegates are asked to review and assess the progress of studies when:\r\n\r\n- A study falls behind the agreed milestones\r\n- A study is not recruiting to target\r\n- And the last progress assessment is over three months old\r\n\r\nSponsors or their delegates can request NIHR RDN support with their research study at any time. [' +
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
              loc: { start: { line: 31, column: 97 }, end: { line: 31, column: 119 } },
            })
          : helper)
      ) +
      ']\r\n\r\nPlease note that providing regular study assessments is a requirement of the Terms and Conditions for NIHR RDN support\r\n[' +
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
              loc: { start: { line: 34, column: 1 }, end: { line: 34, column: 27 } },
            })
          : helper)
      ) +
      ']. Failure to do so may result in removal from the NIHR RDN Portfolio.\r\n\r\n# Nominate someone else to assess research studies\r\n\r\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\r\na new contact.\r\n\r\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\r\nour list contact supportmystudy@nihr.ac.uk.'
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
      "<html lang='en'>\r\n\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>\r\n        You have been nominated as a contact for\r\n        " +
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
      "\r\n        studies on the NIHR Research Delivery Network’s (RDN) research portfolio.\r\n      </p>\r\n\r\n      <p>\r\n        The\r\n        <a href='" +
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
      "'>NIHR RDN</a>\r\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\r\n        and health and care organisations across England.\r\n      </p>\r\n\r\n      <p>\r\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\r\n        delegates on behalf of the Department of Health and Social Care.\r\n      </p>\r\n\r\n      <p>\r\n        NIHR RDN asks Sponsors or their delegates to review these studies and provide regular assessments of how the\r\n        study is progressing.\r\n      </p>\r\n\r\n      <p>\r\n        Please sign in to the Sponsor Engagement Tool to provide updates on studies.\r\n      </p>\r\n\r\n      <a\r\n        href='" +
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
              loc: { start: { line: 38, column: 14 }, end: { line: 38, column: 28 } },
            })
          : helper)
      ) +
      "'\r\n        style='\r\n          box-sizing: border-box;\r\n          display: inline-block;\r\n          position: relative;\r\n          margin-top: 0;\r\n          margin-right: 0;\r\n          margin-left: 0;\r\n          margin-bottom: 22px;\r\n          padding: 8px 10px 7px;\r\n          border: 2px solid rgba(0, 0, 0, 0);\r\n          border-radius: 0;\r\n          color: #fff;\r\n          background-color: #00703c;\r\n          box-shadow: 0 2px 0 #002d18;\r\n          text-align: center;\r\n          vertical-align: top;\r\n          cursor: pointer;\r\n          -webkit-appearance: none;\r\n        '\r\n      >Sign in to assess studies</a>\r\n\r\n      <h2>Why am I being asked to assess studies?</h2>\r\n\r\n      <p>Sponsors or their delegates are asked to review and assess the progress of studies when:</p>\r\n\r\n      <ul>\r\n        <li>A study falls behind the agreed milestones or</li>\r\n        <li>A study is not recruiting to target</li>\r\n        <li>And the last progress assessment is over three months old</li>\r\n      </ul>\r\n\r\n      <p>\r\n        Sponsors or their delegates can request\r\n        <a href='" +
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
              loc: { start: { line: 72, column: 17 }, end: { line: 72, column: 39 } },
            })
          : helper)
      ) +
      "'>NIHR RDN support</a>\r\n        with their research study at any time.\r\n      </p>\r\n\r\n      <p>\r\n        <strong>\r\n          Please note that providing regular study assessments is a requirement of the\r\n          <a href='" +
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
              loc: { start: { line: 79, column: 19 }, end: { line: 79, column: 45 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\r\n          result in removal from the NIHR RDN Portfolio.\r\n        </strong>\r\n      </p>\r\n\r\n      <h2>Nominate someone else to assess studies</h2>\r\n\r\n      <p>\r\n        The NIHR RDN can give other people in your organisation access to this service. Contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\r\n        to add a new contact.\r\n      </p>\r\n\r\n      <p>\r\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\r\n        removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\r\n      </p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>"
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
      '# NIHR RDN has invited you to assess the progress of your studies\r\n\r\nHello,\r\n\r\nYou have been nominated as a contact for ' +
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
      " studies on the NIHR Research Delivery Network's (RDN) research portfolio.\r\n\r\nThe NIHR RDN supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public and health and care organisations across England.\r\n\r\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates on behalf of the Department of Health and Social Care.\r\n\r\nNIHR RDN asks Sponsors or their delegates to review these studies and provide regular assessments of how the study is progressing.\r\n\r\nPlease sign in to the Sponsor Engagement Tool to provide updates on studies. (" +
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
              loc: { start: { line: 13, column: 78 }, end: { line: 13, column: 92 } },
            })
          : helper)
      ) +
      ')\r\n\r\n# Why am I being asked to assess studies?\r\n\r\nSponsors or their delegates are asked to review and assess the progress of studies when:\r\n\r\n- A study falls behind the agreed milestones\r\n- A study is not recruiting to target\r\n- And the last progress assessment is over three months old\r\n\r\nSponsors or their delegates can request NIHR RDN support with their research study at any time. (' +
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
              loc: { start: { line: 23, column: 97 }, end: { line: 23, column: 119 } },
            })
          : helper)
      ) +
      ')\r\n\r\nPlease note that providing regular study assessments is a requirement of the Terms and Conditions for NIHR RDN support.\r\nFailure to do so may result in removal from the NIHR RDN Portfolio. (' +
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
              loc: { start: { line: 26, column: 69 }, end: { line: 26, column: 95 } },
            })
          : helper)
      ) +
      ')\r\n\r\n# Nominate someone else to assess studies\r\n\r\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\r\na new contact.\r\n\r\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\r\nour list, please contact supportmystudy@nihr.ac.uk.\r\n'
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
      "<html lang='en'>\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has removed you as a reviewer for " +
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
      '</h1>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>You have been removed as a reviewer of research studies for\r\n        ' +
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
      ". You will no longer be able to review and assess study progress.\r\n      </p>\r\n\r\n      <hr />\r\n\r\n      <h2>Not sure why you've been removed?</h2>\r\n\r\n      <p>If you think there’s been an error please contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\r\n\r\n      <p>If you’re not sure why you’ve received this email or need to be removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>"
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
      '\r\n\r\nHello, You have been removed as a reviewer of research studies for ' +
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
      ". You will no longer be able to\r\nreview and assess study progress.\r\n\r\n# Not sure why you've been removed?\r\n\r\nIf you think there’s been an error please contact supportmystudy@nihr.ac.uk.\r\n\r\nIf you’re not sure why you’ve received this email or need to be removed from our list contact supportmystudy@nihr.ac.uk."
    )
  },
  useData: true,
})
module.exports = templates
