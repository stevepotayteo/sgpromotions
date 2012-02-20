using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Microsoft.Phone.Controls;
using System.IO;
using System.Windows.Media.Imaging;
using System.Windows.Resources;
using SGPromotions.Util;


namespace SGPromotions
{
    public partial class MainPage : PhoneApplicationPage
    {
        private WebBrowserHelper _browserHelper;

        // Constructor
        public MainPage()
        {
            InitializeComponent();
            // add the various PhoneGap helpers
            new BackButtonHandler(this, PGView);
            _browserHelper = new WebBrowserHelper(PGView.Browser);
            //new BrowserFastClick(PGView.Browser);

            PGView.Browser.ScriptNotify += Browser_ScriptNotify;
            PGView.Browser.Navigated += Browser_Navigated;

            EventHandler<NavigationEventArgs> hideSplashScreen = null;
            hideSplashScreen = (s, e) =>
            {
                fadeOut.Begin();
                PGView.Browser.Navigated -= hideSplashScreen;
            };
            PGView.Browser.Navigated += hideSplashScreen;
        }

        private void Browser_Navigated(object sender, NavigationEventArgs e)
        {
            // when we first navigate to a page, we assume that it can be scrolled
            _browserHelper.ScrollDisabled = false;
        }

        private void Browser_ScriptNotify(object sender, NotifyEventArgs e)
        {
            // if a page notifies that it should not be scrollable, disable
            // scrolling.
            if (e.Value == "noScroll")
            {
                _browserHelper.ScrollDisabled = true;
            }
        }

        private void fadeOut_Completed(object sender, EventArgs e)
        {
            splashImage.Visibility = Visibility.Collapsed;
        }

        private void GapBrowser_Loaded(object sender, RoutedEventArgs e)
        {

        }
    }
}