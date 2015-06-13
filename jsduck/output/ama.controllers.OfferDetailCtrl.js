Ext.data.JsonP.ama_controllers_OfferDetailCtrl({"tagname":"class","name":"ama.controllers.OfferDetailCtrl","autodetected":{},"files":[{"filename":"offerDetailCtrl.js","href":"offerDetailCtrl.html#ama-controllers-OfferDetailCtrl"}],"members":[{"name":"dateFormat","tagname":"property","owner":"ama.controllers.OfferDetailCtrl","id":"property-dateFormat","meta":{}},{"name":"offer","tagname":"property","owner":"ama.controllers.OfferDetailCtrl","id":"property-offer","meta":{}},{"name":"accept","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-accept","meta":{}},{"name":"decline","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-decline","meta":{}},{"name":"deleteItem","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-deleteItem","meta":{}},{"name":"getStateParams","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-getStateParams","meta":{}},{"name":"openMailPreview","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-openMailPreview","meta":{}},{"name":"priceChanged","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-priceChanged","meta":{}},{"name":"send","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-send","meta":{}},{"name":"setFirstItemAsDetail","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-setFirstItemAsDetail","meta":{}},{"name":"viewPdf","tagname":"method","owner":"ama.controllers.OfferDetailCtrl","id":"method-viewPdf","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-ama.controllers.OfferDetailCtrl","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl' target='_blank'>offerDetailCtrl.js</a></div></pre><div class='doc-contents'><p>Controller for the offer detail view.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-dateFormat' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-property-dateFormat' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-property-dateFormat' class='name expandable'>dateFormat</a> : string<span class=\"signature\"></span></div><div class='description'><div class='short'>The app's date format. ...</div><div class='long'><p>The app's date format. <em>DEPRECATED.</em>\nTODO: load dateFormat from Config</p>\n<p>Defaults to: <code>&#39;dd.MM.yyyy&#39;</code></p></div></div></div><div id='property-offer' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-property-offer' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-property-offer' class='name expandable'>offer</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>The current offer.</p>\n</div><div class='long'><p>The current offer.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-accept' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-accept' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-accept' class='name expandable'>accept</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Changes the offer's state to 3 (client accepted)\nOpens a NextStepModal. ...</div><div class='long'><p>Changes the offer's state to 3 (client accepted)\nOpens a <a href=\"#!/api/ama.services.NextStepModal\" rel=\"ama.services.NextStepModal\" class=\"docClass\">NextStepModal</a>.</p>\n</div></div></div><div id='method-decline' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-decline' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-decline' class='name expandable'>decline</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Changes the state of the offer to -1 (client declined) ...</div><div class='long'><p>Changes the state of the offer to -1 (client declined)</p>\n</div></div></div><div id='method-deleteItem' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-deleteItem' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-deleteItem' class='name expandable'>deleteItem</a>( <span class='pre'>itemId</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Deletes an item by given id. ...</div><div class='long'><p>Deletes an item by given id.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>itemId</span> : id<div class='sub-desc'><p>The id of the item to be deleted</p>\n</div></li></ul></div></div></div><div id='method-getStateParams' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-getStateParams' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-getStateParams' class='name expandable'>getStateParams</a>( <span class='pre'>forState</span> ) : {referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}<span class=\"signature\"></span></div><div class='description'><div class='short'>Generates a stateParams object from the current stateParams for a certain state ...</div><div class='long'><p>Generates a stateParams object from the current stateParams for a certain state</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>forState</span> : string<div class='sub-desc'><p>The state for which the stateParams should be generated</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>{referrer: string, referrerParams: {id: ($stateParams.id|*)}, for: string, forId: ($stateParams.id|*)}</span><div class='sub-desc'><p>The stateParams for the state to be transitioned to, generated from the current stateParams.</p>\n</div></li></ul></div></div></div><div id='method-openMailPreview' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-openMailPreview' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-openMailPreview' class='name expandable'>openMailPreview</a>( <span class='pre'>event</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses the MailService to show a mail preview for the current offer. ...</div><div class='long'><p>Uses the <a href=\"#!/api/ama.services.MailService\" rel=\"ama.services.MailService\" class=\"docClass\">MailService</a> to show a mail preview for the current offer.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Event<div class='sub-desc'><p>The event (click) that led to the function call</p>\n</div></li></ul></div></div></div><div id='method-priceChanged' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-priceChanged' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-priceChanged' class='name expandable'>priceChanged</a>( <span class='pre'>item</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Gets called when the price of an item inside the offer changes. ...</div><div class='long'><p>Gets called when the price of an item inside the offer changes.\nReloads the offer.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>item</span> : Object<div class='sub-desc'><p>The item that was changed.</p>\n</div></li></ul></div></div></div><div id='method-send' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-send' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-send' class='name expandable'>send</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses the MailService to send a mail with the current offer. ...</div><div class='long'><p>Uses the <a href=\"#!/api/ama.services.MailService\" rel=\"ama.services.MailService\" class=\"docClass\">MailService</a> to send a mail with the current offer.</p>\n</div></div></div><div id='method-setFirstItemAsDetail' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-setFirstItemAsDetail' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-setFirstItemAsDetail' class='name expandable'>setFirstItemAsDetail</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the first item of a provided list as active item in the MasterDetail view ...</div><div class='long'><p>Sets the first item of a provided list as active item in the MasterDetail view</p>\n</div></div></div><div id='method-viewPdf' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ama.controllers.OfferDetailCtrl'>ama.controllers.OfferDetailCtrl</span><br/><a href='source/offerDetailCtrl.html#ama-controllers-OfferDetailCtrl-method-viewPdf' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ama.controllers.OfferDetailCtrl-method-viewPdf' class='name expandable'>viewPdf</a>( <span class='pre'>event, preview, path</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Uses the PdfService to show either a PDF preview\nor the generated PDF of the offer. ...</div><div class='long'><p>Uses the <a href=\"#!/api/ama.services.PdfService\" rel=\"ama.services.PdfService\" class=\"docClass\">PdfService</a> to show either a PDF preview\nor the generated PDF of the offer.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>event</span> : Event<div class='sub-desc'><p>The event (commonly 'click') that triggered the function call</p>\n</div></li><li><span class='pre'>preview</span> : bool<div class='sub-desc'><p>Indicates if a preview or the generated PDF should be shown</p>\n</div></li><li><span class='pre'>path</span> : String<div class='sub-desc'><p><em>optional</em> Path to the generated PDF</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});