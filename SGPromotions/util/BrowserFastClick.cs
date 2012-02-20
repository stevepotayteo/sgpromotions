using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using LinqToVisualTree;
using Microsoft.Phone.Controls;
using System.Diagnostics;

namespace SGPromotions.Util
{
    /// <summary>
    /// Captures mouse left button up events, triggering an immediate
    /// click event on the clicked DOM element.
    /// </summary>
    public class BrowserFastClick
    {
        private WebBrowser _browser;

        private Border _border;

        public BrowserFastClick(WebBrowser browser)
        {
            _browser = browser;
            browser.Loaded += new RoutedEventHandler(Browser_Loaded);
        }

        private void Browser_Loaded(object sender, RoutedEventArgs e)
        {
            // locate the element used to capture mouse events
            _border = _browser.Descendants<Border>().Last() as Border;
            _border.Tap += Border_Tap;
        }

        private void Border_Tap(object sender, GestureEventArgs e)
        {
            //determine the click location
            var pos = e.GetPosition(_border);

            // forward to the browser
            _browser.InvokeScript("eval",
              string.Format("document.elementFromPoint({0},{1}).click()", pos.X, pos.Y));
        }
    }
}
