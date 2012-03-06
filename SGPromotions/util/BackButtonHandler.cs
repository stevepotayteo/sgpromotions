using System.Collections.Generic;
using WP7CordovaClassLib;
using Microsoft.Phone.Controls;
using System.ComponentModel;
using System.Windows.Navigation;

namespace sgpromotions.Util
{
    /// <summary>
    /// Handles the back-button for a PhoneGap application. When the back-button
    /// is pressed, the browser history is navigated. If no history is present,
    /// the application will exit.
    /// </summary>
    public class BackButtonHandler
    {
        private WebBrowser _browser;

        private List<string> _backStack = new List<string>();

        public BackButtonHandler(PhoneApplicationPage page, CordovaView phoneGapView)
        {
            // subscribe to the hardware back-button
            page.BackKeyPress += Page_BackKeyPress;

            _browser = phoneGapView.Browser;

            // handle navigation events
            _browser.Navigated += Browser_Navigated;

        }

        /// <summary>
        /// Handle navigation in order to update our back-stack
        /// </summary>
        private void Browser_Navigated(object sender, NavigationEventArgs e)
        {
            string url = _browser.Source.OriginalString;

            // ensure all slashes are the same
            // app\www/index.html
            // see: https://issues.apache.org/jira/browse/CB-184
            url = url.Replace("\\", "/");

            if (_backStack.Count < 2)
            {
                _backStack.Add(url);
            }
            else
            {
                // check whether the URL represents a backwards navigation
                string previousPage = _backStack[_backStack.Count - 2];
                if (previousPage == url)
                {
                    _backStack.RemoveAt(_backStack.Count - 1);
                }
            }
        }

        /// <summary>
        /// Handle the hardware back-button
        /// </summary>
        private void Page_BackKeyPress(object sender, CancelEventArgs e)
        {
            // if we have items in the back-stack, route this event
            // to the browser
            if (_backStack.Count > 1)
            {
                _browser.InvokeScript("eval", "history.go(-1)");
                e.Cancel = true;
            }
        }
    }
}
