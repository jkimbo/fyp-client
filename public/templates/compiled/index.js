window.T = window.T || {}; window.T.index = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"row\">");t.b("\n" + i);t.b("  <div id=\"index\">");t.b("\n" + i);t.b("    <h1>Coach Tracker</h1>");t.b("\n" + i);t.b("    <p>Welcome to the coach tracker</p>");t.b("\n" + i);t.b("    <form id=\"indexform\">");t.b("\n" + i);t.b("      <fieldset>");t.b("\n" + i);t.b("        <div class=\"control-group\">");t.b("\n" + i);t.b("          <label class=\"control-label\" for=\"curlocation\">Your location:</label>");t.b("\n" + i);t.b("          <div class=\"controls\">");t.b("\n" + i);t.b("            <div class=\"input-prepend\">");t.b("\n" + i);t.b("              <span class=\"add-on\"><a href=\"#\" id=\"togglelocation\"><i class=\"icon-loading\"></i></a></span><input type=\"text\" class=\"span2\" id=\"curlocation\"/>");t.b("\n" + i);t.b("            </div>");t.b("\n" + i);t.b("            <p class=\"help-block\">If your location is not correct then please click the icon above and input your location manually</p>");t.b("\n" + i);t.b("          </div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("        <div class=\"control-group\">");t.b("\n" + i);t.b("          <label class=\"control-label\" for=\"showstops\">Show stops near me</label>");t.b("\n" + i);t.b("          <div class=\"controls\">");t.b("\n" + i);t.b("            <button class=\"btn btn-primary\" id=\"findstops\">Go!</button>");t.b("\n" + i);t.b("          </div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("        <div class=\"control-group\">");t.b("\n" + i);t.b("          <label class=\"control-label\" for=\"destination\">Or select your destination:</label>");t.b("\n" + i);t.b("          <div class=\"controls\">");t.b("\n" + i);t.b("            <div class=\"input-prepend\">");t.b("\n" + i);t.b("              <span class=\"add-on\"><i class=\"icon-flag\"></i> </span><input type=\"text\" class=\"span2\" id=\"destination\"/>");t.b("\n" + i);t.b("            </div>");t.b("\n" + i);t.b("          </div>");t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("      </fieldset>");t.b("\n" + i);t.b("    </form>");t.b("\n" + i);t.b("  </div>");t.b("\n" + i);t.b("</div>");t.b("\n");return t.fl(); },partials: {}, subs: {  }});