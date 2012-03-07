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
using sgpromotions.Util;
using Microsoft.Phone.Shell;
using System.Threading;
using Microsoft.Phone.Tasks;


namespace sgpromotions
{
    public partial class MainPage : PhoneApplicationPage
    {
        private WebBrowserHelper _browserHelper;
        private readonly object syncLock = new object();
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

        private void GapBrowser_Loaded(object sender, RoutedEventArgs e)
        {

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
            string commandStr = e.Value;

            if(commandStr == "noScroll")
            {
                _browserHelper.ScrollDisabled = true;
            } 
            else if(commandStr == "phoneTaskEmail")
            {
                EmailComposeTask emailComposeTask = new EmailComposeTask();

                emailComposeTask.Subject = "Regarding sg.promotions";
                emailComposeTask.Body = "";
                emailComposeTask.To = "kelltainer@live.com.sg";
                emailComposeTask.Cc = "";
                emailComposeTask.Bcc = "";

                emailComposeTask.Show();
            }
            else if (commandStr == "phoneTaskRate")
            {
                MarketplaceReviewTask marketplaceReviewTask = new MarketplaceReviewTask();

                marketplaceReviewTask.Show();
            }
            //else if (commandStr == "phoneTaskWebsite")
            //{
            //    WebBrowserTask webBrowserTask = new WebBrowserTask();

            //    webBrowserTask.Uri = new Uri("http://www.kaosfoundry.com", UriKind.Absolute);

            //    webBrowserTask.Show();
            //}
            //else if(commandStr == "phoneTaskTwitter")
            //{
            //    WebBrowserTask webBrowserTask = new WebBrowserTask();

            //    webBrowserTask.Uri = new Uri("http://twitter.com/kelltainer", UriKind.Absolute);

            //    webBrowserTask.Show();
            //}

            // <button onclick="window.external.Notify('clearTextBox');">clear textbox</button> <- can do real shit here.
            // app bar code
        }

        private void fadeOut_Completed(object sender, EventArgs e)
        {
            splashImage.Visibility = Visibility.Collapsed;
            ApplicationBar = ((ApplicationBar) this.Resources["MainAppBar"]);
            ApplicationBar.IsVisible = true;
            SystemTray.IsVisible = true;
        }

        // Appbar section

        private void AppbarButtonHome_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_home");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

        private void AppbarButtonNearby_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_nearby");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

        private void AppbarButtonLocation_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_location");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

        private void AppbarButtonMRT_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_mrt");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

        private void AppBarMenuItemAbout_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_about");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

        private void AppBarMenuItemSettings_Click(object sender, EventArgs e)
        {
            try
            {
                lock (syncLock)
                {
                    PGView.Browser.InvokeScript("appbar_settings");
                }
            }
            catch (System.Exception ex)
            {
            }
        }

    }
}