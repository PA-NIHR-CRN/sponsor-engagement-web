var handlebars = require("handlebars/runtime"); var templates = {}
templates['assessment-reminder.html.hbs'] = handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "            <li>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</li>\r\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<html lang='en'>\r\n\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\r\n\r\n      <p style='font-size: 19px; font-weight:700; display: flex;'>\r\n        <img src='"
    + alias4(((helper = (helper = lookupProperty(helpers,"iconUrl") || (depth0 != null ? lookupProperty(depth0,"iconUrl") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"iconUrl","hash":{},"data":data,"loc":{"start":{"line":9,"column":18},"end":{"line":9,"column":29}}}) : helper)))
    + "' style='display:block; width: 35px; height: 35px;' />\r\n        <span style='margin-left: 10px; margin-top: 3px;'>There are one or more studies to assess</span>\r\n      </p>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>You are a nominated contact for studies on the NIHR Research Delivery Network’s (RDN) research portfolio for:\r\n        <br />\r\n        <ul>\r\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"organisationNames") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":18,"column":10},"end":{"line":20,"column":19}}})) != null ? stack1 : "")
    + "        </ul>\r\n      </p>\r\n\r\n      <p>\r\n        One or more studies require an update. Please sign in to the Sponsor Engagement Tool to provide these updates.\r\n      </p>\r\n\r\n      <p>As a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor\r\n        Engagement Tool does not associate contacts to specific studies or groups of studies, only to the organisation.\r\n      </p>\r\n\r\n      <a\r\n        href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"signInLink") || (depth0 != null ? lookupProperty(depth0,"signInLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"signInLink","hash":{},"data":data,"loc":{"start":{"line":33,"column":14},"end":{"line":33,"column":28}}}) : helper)))
    + "'\r\n        style='\r\n          box-sizing: border-box;\r\n          display: inline-block;\r\n          position: relative;\r\n          margin-top: 0;\r\n          margin-right: 0;\r\n          margin-left: 0;\r\n          margin-bottom: 22px;\r\n          padding: 8px 10px 7px;\r\n          border: 2px solid rgba(0, 0, 0, 0);\r\n          border-radius: 0;\r\n          color: #fff;\r\n          background-color: #00703c;\r\n          box-shadow: 0 2px 0 #002d18;\r\n          text-align: center;\r\n          vertical-align: top;\r\n          cursor: pointer;\r\n          -webkit-appearance: none;\r\n        '\r\n      >Sign in to assess studies</a>\r\n\r\n      <h2>Why am I being asked to assess studies?</h2>\r\n\r\n      <p>\r\n        The\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"rdnLink") || (depth0 != null ? lookupProperty(depth0,"rdnLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rdnLink","hash":{},"data":data,"loc":{"start":{"line":59,"column":17},"end":{"line":59,"column":28}}}) : helper)))
    + "'>NIHR RDN</a>\r\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\r\n        and health and care organisations across England.\r\n      </p>\r\n\r\n      <p>\r\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\r\n        delegates on behalf of the Department of Health and Social Care (DHSC).\r\n      </p>\r\n\r\n      <p>The DHSC have published the\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":70,"column":17},"end":{"line":70,"column":43}}}) : helper)))
    + "'>Terms and Conditions for NIHR RDN support</a>\r\n        ,which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the\r\n        RDN.\r\n      </p>\r\n\r\n      <p>The Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements\r\n        outlined in the T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the\r\n        RDN holds on their organisation’s portfolio of studies, and to provide study data updates and assessments to\r\n        ensure the data held by the RDN is complete and up-to-date.\r\n      </p>\r\n\r\n      <p>Sponsors or their delegates are prompted to review and assess the progress of studies when:</p>\r\n\r\n      <ul>\r\n        <li>A study falls behind a planned milestone or</li>\r\n        <li>A study appears to not be recruiting to target</li>\r\n        <li>And the last study assessment is over three months old</li>\r\n      </ul>\r\n\r\n      <p>\r\n        Sponsors or their delegates can request\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"requestSupportLink") || (depth0 != null ? lookupProperty(depth0,"requestSupportLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"requestSupportLink","hash":{},"data":data,"loc":{"start":{"line":91,"column":17},"end":{"line":91,"column":39}}}) : helper)))
    + "'>NIHR RDN support</a>\r\n        with study delivery and performance at any time.\r\n      </p>\r\n\r\n      <p>\r\n        <strong>\r\n          Please note that providing regular study updates and assessments are requirements of the\r\n          <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":98,"column":19},"end":{"line":98,"column":45}}}) : helper)))
    + "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\r\n          result in removal from the NIHR RDN Portfolio.\r\n        </strong>\r\n      </p>\r\n\r\n      <h2>Nominate someone else to assess research studies</h2>\r\n\r\n      <p>\r\n        The NIHR RDN can give other people in your organisation access to this service. Contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\r\n        to add a new contact.\r\n      </p>\r\n\r\n      <hr />\r\n\r\n      <p>\r\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\r\n        removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\r\n      </p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>";
},"useData":true})
templates['assessment-reminder.text.hbs'] = handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# Assess progress of research studies in NIHR RDN portfolio\r\n\r\nThere are one or more studies to assess\r\n\r\nSign-in ["
    + alias4(((helper = (helper = lookupProperty(helpers,"signInLink") || (depth0 != null ? lookupProperty(depth0,"signInLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"signInLink","hash":{},"data":data,"loc":{"start":{"line":5,"column":9},"end":{"line":5,"column":23}}}) : helper)))
    + "]\r\n\r\nHello,\r\n\r\nYou are a nominated contact for "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationNames") || (depth0 != null ? lookupProperty(depth0,"organisationNames") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationNames","hash":{},"data":data,"loc":{"start":{"line":9,"column":32},"end":{"line":9,"column":53}}}) : helper)))
    + " for studies on the NIHR Research Delivery Network’s (RDN) research portfolio. One\r\nor more studies require an update. Please sign in to the Sponsor Engagement Tool to provide these updates.\r\n\r\nAs a nominated contact for your organisation, you will see all studies linked to your organisation. The Sponsor Engagement Tool\r\ndoes not associate contacts to specific studies or groups of studies, only to the organisation.\r\n\r\n# Why am I being asked to assess studies?\r\n\r\nThe NIHR RDN ["
    + alias4(((helper = (helper = lookupProperty(helpers,"rdnLink") || (depth0 != null ? lookupProperty(depth0,"rdnLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rdnLink","hash":{},"data":data,"loc":{"start":{"line":17,"column":14},"end":{"line":17,"column":25}}}) : helper)))
    + "] supports Sponsors and their delegates to deliver high-quality research, for the benefit of\r\npatients, the public and health and care organisations across England.\r\n\r\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates\r\non behalf of the Department of Health and Social Care (DHSC).\r\n\r\nThe DHSC have published the Terms and Conditions for NIHR RDN support ["
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":23,"column":71},"end":{"line":23,"column":97}}}) : helper)))
    + "], which outlines \r\nthe requirements for Sponsors to provide up-to-date study data and assessments of progress to the RDN. \r\n\r\nThe Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements outlined in \r\nthe T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the RDN holds on their organisation’s portfolio of studies, \r\nand to provide study data updates and assessments to ensure the data held by the RDN is complete and up-to-date.\r\n\r\nSponsors or their delegates are prompted to review and assess the progress of studies when:\r\n\r\n- A study falls behind a planned milestone or\r\n- A study appears to not be recruiting to target\r\n- And the last study assessment is over three months old\r\n\r\nSponsors or their delegates can request NIHR RDN support with study delivery and performance at any time. ["
    + alias4(((helper = (helper = lookupProperty(helpers,"requestSupportLink") || (depth0 != null ? lookupProperty(depth0,"requestSupportLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"requestSupportLink","hash":{},"data":data,"loc":{"start":{"line":36,"column":107},"end":{"line":36,"column":129}}}) : helper)))
    + "]\r\n\r\nPlease note that providing regular study updates and assessments are requirements of the Terms and Conditions for NIHR RDN support\r\n["
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":39,"column":1},"end":{"line":39,"column":27}}}) : helper)))
    + "]. Failure to do so may result in removal from the NIHR RDN Portfolio.\r\n\r\n# Nominate someone else to assess research studies\r\n\r\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\r\na new contact.\r\n\r\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\r\nour list contact supportmystudy@nihr.ac.uk.";
},"useData":true})
templates['contact-assigned.html.hbs'] = handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<html lang='en'>\r\n\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has invited you to assess the progress of your studies</h1>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>\r\n        You have been nominated as a contact for\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":28}}}) : helper)))
    + "\r\n        on the NIHR Research Delivery Network’s (RDN) research portfolio.\r\n      </p>\r\n\r\n      <p>\r\n        The\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"rdnLink") || (depth0 != null ? lookupProperty(depth0,"rdnLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"rdnLink","hash":{},"data":data,"loc":{"start":{"line":18,"column":17},"end":{"line":18,"column":28}}}) : helper)))
    + "'>NIHR RDN</a>\r\n        supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public\r\n        and health and care organisations across England.\r\n      </p>\r\n\r\n      <p>\r\n        The NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their\r\n        delegates on behalf of the Department of Health and Social Care (DHSC).\r\n      </p>\r\n\r\n      <p>\r\n        The DHSC have published the\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":30,"column":17},"end":{"line":30,"column":43}}}) : helper)))
    + "'>Terms and Conditions for NIHR RDN support</a>\r\n        ,which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the\r\n        RDN.\r\n      </p>\r\n\r\n      <p>\r\n        The Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements\r\n        outlined in the T&Cs. Sponsors and their delegates should use the Sponsor Engagement Tool to review the data the\r\n        RDN holds on their organisations portfolio of studies and to provide study data updates and assessments to ensure\r\n        the data held by the RDN is complete and up-to-date.\r\n      </p>\r\n\r\n      <p>\r\n        Please sign in to the Sponsor Engagement Tool to provide updates on studies.\r\n      </p>\r\n\r\n      <a\r\n        href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"signInLink") || (depth0 != null ? lookupProperty(depth0,"signInLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"signInLink","hash":{},"data":data,"loc":{"start":{"line":47,"column":14},"end":{"line":47,"column":28}}}) : helper)))
    + "'\r\n        style='\r\n          box-sizing: border-box;\r\n          display: inline-block;\r\n          position: relative;\r\n          margin-top: 0;\r\n          margin-right: 0;\r\n          margin-left: 0;\r\n          margin-bottom: 22px;\r\n          padding: 8px 10px 7px;\r\n          border: 2px solid rgba(0, 0, 0, 0);\r\n          border-radius: 0;\r\n          color: #fff;\r\n          background-color: #00703c;\r\n          box-shadow: 0 2px 0 #002d18;\r\n          text-align: center;\r\n          vertical-align: top;\r\n          cursor: pointer;\r\n          -webkit-appearance: none;\r\n        '\r\n      >Sign in to assess studies</a>\r\n\r\n      <h2>Why am I being asked to assess studies?</h2>\r\n\r\n      <p>Sponsors or their delegates are asked to review and assess the progress of studies when:</p>\r\n\r\n      <ul>\r\n        <li>A study falls behind a planned milestone or</li>\r\n        <li> A study appears to not be recruiting to target</li>\r\n        <li> And the last study assessment is over three months old</li>\r\n      </ul>\r\n\r\n      <p>\r\n        Sponsors or their delegates can request\r\n        <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"requestSupportLink") || (depth0 != null ? lookupProperty(depth0,"requestSupportLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"requestSupportLink","hash":{},"data":data,"loc":{"start":{"line":81,"column":17},"end":{"line":81,"column":39}}}) : helper)))
    + "'>NIHR RDN support</a>\r\n        with study delivery and performance at any time.\r\n      </p>\r\n\r\n      <p>\r\n        <strong>\r\n          Please note that providing regular study data updates and assessments are requirements of the\r\n          <a href='"
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":88,"column":19},"end":{"line":88,"column":45}}}) : helper)))
    + "'>Terms and Conditions for NIHR RDN support</a>. Failure to do so may\r\n          result in removal from the NIHR RDN Portfolio.\r\n        </strong>\r\n      </p>\r\n\r\n      <h2>Nominate someone else to assess studies</h2>\r\n\r\n      <p>\r\n        The NIHR RDN can give other people in your organisation access to this service. Contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>\r\n        to add a new contact.\r\n      </p>\r\n\r\n      <hr />\r\n\r\n      <p>\r\n        This email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be\r\n        removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.\r\n      </p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>";
},"useData":true})
templates['contact-assigned.text.hbs'] = handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# NIHR RDN has invited you to assess the progress of your studies\r\n\r\nHello,\r\n\r\nYou have been nominated as a contact for "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":5,"column":41},"end":{"line":5,"column":61}}}) : helper)))
    + " studies on the NIHR Research Delivery Network's (RDN) research portfolio.\r\n\r\nThe NIHR RDN supports Sponsors and their delegates to deliver high-quality research, for the benefit of patients, the public and health and care organisations across England.\r\n\r\nThe NIHR RDN tracks the progress of research studies in its portfolio using data provided by Sponsors or their delegates on behalf of the Department of Health and Social Care (DHSC).\r\n\r\nThe DHSC have published the Terms and Conditions for NIHR RDN support ("
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":11,"column":71},"end":{"line":11,"column":97}}}) : helper)))
    + "), which outlines the requirements for Sponsors to provide up-to-date study data and assessments of progress to the RDN.\r\n\r\nThe Sponsor Engagement Tool has been designed to support Sponsors and their delegates to meet the requirements outlined in the T&Cs. \r\nSponsors and their delegates should use the Sponsor Engagement Tool to review the data the RDN holds on their organisations portfolio \r\nof studies and to provide study data updates and assessments to ensure the data held by the RDN is complete and up-to-date.\r\n\r\nPlease sign in to the Sponsor Engagement Tool to provide updates on studies. ("
    + alias4(((helper = (helper = lookupProperty(helpers,"signInLink") || (depth0 != null ? lookupProperty(depth0,"signInLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"signInLink","hash":{},"data":data,"loc":{"start":{"line":17,"column":78},"end":{"line":17,"column":92}}}) : helper)))
    + ")\r\n\r\n# Why am I being asked to assess studies?\r\n\r\nSponsors or their delegates are asked to review and assess the progress of studies when:\r\n\r\n- A study falls behind a planned milestone or\r\n- A study appears to not be recruiting to target\r\n- And the last study assessment is over three months old\r\n\r\nSponsors or their delegates can request NIHR RDN support with study delivery and performance at any time. ("
    + alias4(((helper = (helper = lookupProperty(helpers,"requestSupportLink") || (depth0 != null ? lookupProperty(depth0,"requestSupportLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"requestSupportLink","hash":{},"data":data,"loc":{"start":{"line":27,"column":107},"end":{"line":27,"column":129}}}) : helper)))
    + ")\r\n\r\nPlease note that providing regular study data updates and assessments are requirements of the Terms and Conditions for NIHR RDN support. \r\nFailure to do so may result in removal from the NIHR RDN Portfolio.("
    + alias4(((helper = (helper = lookupProperty(helpers,"termsAndConditionsLink") || (depth0 != null ? lookupProperty(depth0,"termsAndConditionsLink") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"termsAndConditionsLink","hash":{},"data":data,"loc":{"start":{"line":30,"column":68},"end":{"line":30,"column":94}}}) : helper)))
    + ")\r\n\r\n# Nominate someone else to assess studies\r\n\r\nThe NIHR RDN can give other people in your organisation access to this service. Contact supportmystudy@nihr.ac.uk to add\r\na new contact.\r\n\r\nThis email is not monitored, do not reply. If you’re not sure why you’ve received this email or need to be removed from\r\nour list, please contact supportmystudy@nihr.ac.uk.\r\n";
},"useData":true})
templates['contact-removed.html.hbs'] = handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<html lang='en'>\r\n  <body>\r\n    <div>\r\n      <h1>NIHR RDN has removed you as a reviewer for "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":5,"column":53},"end":{"line":5,"column":73}}}) : helper)))
    + "</h1>\r\n\r\n      <p>Hello,</p>\r\n\r\n      <p>You have been removed as a reviewer of research studies for\r\n        "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":10,"column":8},"end":{"line":10,"column":28}}}) : helper)))
    + ". You will no longer be able to review and assess study progress.\r\n      </p>\r\n\r\n      <hr />\r\n\r\n      <h2>Not sure why you've been removed?</h2>\r\n\r\n      <p>If you think there’s been an error please contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\r\n\r\n      <p>If you’re not sure why you’ve received this email or need to be removed from our list contact\r\n        <a href='mailto:supportmystudy@nihr.ac.uk'>supportmystudy@nihr.ac.uk</a>.</p>\r\n    </div>\r\n\r\n    <br />\r\n\r\n    <div>\r\n      <table style='width: 540px; border-collapse: collapse'>\r\n        <tbody>\r\n          <tr>\r\n            <td style='width: 162px'>\r\n              <p>\r\n                &nbsp;<img\r\n                  src='https://www.nihr.ac.uk/layout/4.0/assets/external/nihr-logo.png'\r\n                  alt='NIHRLogo'\r\n                  width='206'\r\n                  class='CToWUd'\r\n                  data-bit='iit'\r\n                />\r\n              </p>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n\r\n      <p>\r\n        <a\r\n          href='https://www.nihr.ac.uk/explore-nihr/campaigns/nhs-75/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=nhs75&amp;utm_term=signature&amp;utm_content=signature'\r\n          target='_blank'\r\n        ><img\r\n            src='https://www.nihr.ac.uk/layout/img/external/nhs75-shape-the-future-signature.png'\r\n            alt='NIHR, Supporting NHS75. Life changing research funded by the public. Click, get involved in our NHS75 campaign'\r\n            width='540'\r\n            height='101'\r\n            class='CToWUd'\r\n            data-bit='iit'\r\n          />\r\n        </a>\r\n      </p>\r\n\r\n      <p>\r\n        Follow us:\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/f_logo_RGB-Blue_58.png'\r\n          alt='FB Logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.facebook.com/OfficialNIHR' target='_blank'>OfficialNIHR</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/Twitter_Logo_Blue.png'\r\n          alt='Twitter logo'\r\n          width='11'\r\n          height='11'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://twitter.com/NIHRresearch' target='_blank'>@NIHRresearch</a>&nbsp;|&nbsp;<img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/LI-In-Bug.png'\r\n          alt='LI Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        /><a href='https://www.linkedin.com/company/nihr-research' target='_blank'>NIHR</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/images/about-us/stay-up-to-date/youtube_logo_rgb_light.png'\r\n          alt='Youtube Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a href='https://www.youtube.com/user/NIHRtv' target='_blank'>NIHRtv</a>\r\n        |\r\n        <img\r\n          src='https://www.nihr.ac.uk/layout/img/external/nihr-link-icon.png'\r\n          alt='URL Logo'\r\n          width='11'\r\n          height='9'\r\n          class='CToWUd'\r\n          data-bit='iit'\r\n        />\r\n        <a\r\n          href='https://www.nihr.ac.uk/?utm_source=gmail&amp;utm_medium=email&amp;utm_campaign=ccsignature'\r\n          target='_blank'\r\n        >nihr.ac.uk</a>\r\n      </p>\r\n      <br />\r\n      <br />\r\n      <p style='color: rgb(34, 34, 34); font-family: arial, sans-serif; background-color: rgb(255, 255, 255)'>\r\n        Confidential information may be contained in this message. If you are not the intended recipient, any reading,\r\n        printing, storage, disclosure, copying or any other action taken in respect of this e-mail is prohibited and may\r\n        be unlawful. If you are not the intended recipient, please notify the sender immediately by using the reply\r\n        function and then permanently delete what you have received.\r\n      </p>\r\n    </div>\r\n  </body>\r\n\r\n</html>";
},"useData":true})
templates['contact-removed.text.hbs'] = handlebars.template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# NIHR RDN has removed you as a reviewer for "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":1,"column":45},"end":{"line":1,"column":65}}}) : helper)))
    + "\r\n\r\nHello, You have been removed as a reviewer of research studies for "
    + alias4(((helper = (helper = lookupProperty(helpers,"organisationName") || (depth0 != null ? lookupProperty(depth0,"organisationName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"organisationName","hash":{},"data":data,"loc":{"start":{"line":3,"column":67},"end":{"line":3,"column":87}}}) : helper)))
    + ". You will no longer be able to\r\nreview and assess study progress.\r\n\r\n# Not sure why you've been removed?\r\n\r\nIf you think there’s been an error please contact supportmystudy@nihr.ac.uk.\r\n\r\nIf you’re not sure why you’ve received this email or need to be removed from our list contact supportmystudy@nihr.ac.uk.";
},"useData":true})
module.exports = templates