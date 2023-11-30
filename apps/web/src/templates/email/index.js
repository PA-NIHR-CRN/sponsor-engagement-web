var handlebars = require('handlebars/runtime')
var templates = {}
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
      "<html lang='en'>\r\n  <body>\r\n    <div>\r\n      <h1>NIHR CRN has invited you to assess the progress of your studies</h1>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>\r\n        You have been nominated as a contact for\r\n        " +
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
              loc: { start: { line: 11, column: 8 }, end: { line: 11, column: 28 } },
            })
          : helper)
      ) +
      "\r\n        studies on the NIHR Clinical Research Network’s (CRN) research portfolio.\r\n      </p>\r\n\r\n      <p>\r\n        The\r\n        <a href='" +
      alias4(
        ((helper =
          (helper =
            lookupProperty(helpers, 'crnLink') || (depth0 != null ? lookupProperty(depth0, 'crnLink') : depth0)) != null
            ? helper
            : alias2),
        typeof helper === alias3
          ? helper.call(alias1, {
              name: 'crnLink',
              hash: {},
              data: data,
              loc: { start: { line: 17, column: 17 }, end: { line: 17, column: 28 } },
            })
          : helper)
      ) +
      "'>NIHR CRN</a>\r\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\r\n        and health and care organisations across England.\r\n      </p>\r\n\r\n      <p>\r\n        The NIHR CRN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\r\n        delegates on behalf of the Department of Health and Social Care.\r\n      </p>\r\n\r\n      <p>\r\n        NIHR CRN asks Sponsors or their delegates to review these studies and provide regular assessments of how the\r\n        study is progressing.\r\n      </p>\r\n\r\n      <p>\r\n        Please sign in to the Sponsor Engagement Tool to provide updates on studies.\r\n      </p>\r\n\r\n      <a\r\n        href='" +
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
              loc: { start: { line: 37, column: 14 }, end: { line: 37, column: 28 } },
            })
          : helper)
      ) +
      "'\r\n        style='\r\n          box-sizing: border-box;\r\n          display: inline-block;\r\n          position: relative;\r\n          margin-top: 0;\r\n          margin-right: 0;\r\n          margin-left: 0;\r\n          margin-bottom: 22px;\r\n          padding: 8px 10px 7px;\r\n          border: 2px solid rgba(0, 0, 0, 0);\r\n          border-radius: 0;\r\n          color: #fff;\r\n          background-color: #00703c;\r\n          box-shadow: 0 2px 0 #002d18;\r\n          text-align: center;\r\n          vertical-align: top;\r\n          cursor: pointer;\r\n          -webkit-appearance: none;\r\n        '\r\n      >Sign in to assess studies</a>\r\n\r\n      <h2>Why am I being asked to assess studies?</h2>\r\n\r\n      <p>Sponsors or their delegates are asked to review and assess the progress of studies when:</p>\r\n\r\n      <ul>\r\n        <li>A study falls behind the agreed milestones</li>\r\n        <li>A study is not recruiting to target</li>\r\n        <li>And the last progress assessment is over three months old</li>\r\n      </ul>\r\n\r\n      <p>\r\n        Sponsors or their delegates can request\r\n        <a href='" +
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
              loc: { start: { line: 71, column: 17 }, end: { line: 71, column: 39 } },
            })
          : helper)
      ) +
      "'>NIHR CRN support</a>\r\n        with their research study at any time.\r\n      </p>\r\n\r\n      <p>\r\n        <strong>\r\n          Please note that providing regular study assessments is a requirement of the\r\n          <a href='" +
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
              loc: { start: { line: 78, column: 19 }, end: { line: 78, column: 45 } },
            })
          : helper)
      ) +
      "'>Terms and Conditions for NIHR CRN support</a>. Failure to do so may\r\n          result in removal from the NIHR CRN Portfolio.\r\n        </strong>\r\n      </p>\r\n\r\n      <h2>Nominate someone else to assess studies</h2>\r\n\r\n      <p>\r\n        The NIHR CRN can give other people in your organisation access to this service. Contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\r\n        to add a new contact.\r\n      </p>\r\n\r\n      <p>\r\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\r\n        removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\r\n      </p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>"
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
      '# NIHR CRN has invited you to assess the progress of your studies\r\n\r\nHello,\r\n\r\nYou have been nominated as a contact for ' +
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
      " studies on the NIHR Clinical Research Network's (CRN) research portfolio.\r\n\r\nThe NIHR CRN supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public and health and care organisations across England.\r\n\r\nThe NIHR CRN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates on behalf of the Department of Health and Social Care.\r\n\r\nNIHR CRN asks Sponsors or their delegates to review these studies and provide regular assessments of how the study is progressing.\r\n\r\nPlease sign in to the Sponsor Engagement Tool to provide updates on studies. (" +
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
      ')\r\n\r\n# Why am I being asked to assess studies?\r\n\r\nSponsors or their delegates are asked to review and assess the progress of studies when:\r\n\r\n- A study falls behind the agreed milestones\r\n- A study is not recruiting to target\r\n- And the last progress assessment is over three months old\r\n\r\nSponsors or their delegates can request NIHR CRN support with their research study at any time. (' +
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
      ')\r\n\r\nPlease note that providing regular study assessments is a requirement of the Terms and Conditions for NIHR CRN support.\r\nFailure to do so may result in removal from the NIHR CRN Portfolio. (' +
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
      ')\r\n\r\n# Nominate someone else to assess studies\r\n\r\nThe NIHR CRN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\r\na new contact.\r\n\r\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\r\nour list, please contact supportmystudy@nihr.ac.uk.\r\n'
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
      "<html lang='en'>\r\n  <body>\r\n    <div>\r\n      <h1>NIHR CRN has removed you as a reviewer for " +
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
      '# NIHR CRN has removed you as a reviewer for ' +
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
