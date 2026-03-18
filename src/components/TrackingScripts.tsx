import Script from 'next/script'
import fs from 'fs'
import path from 'path'

type TrackingConfig = {
  google_analytics_id: string
  google_tag_manager_id: string
  google_search_console: string
  facebook_pixel_id: string
  custom_head_scripts: string
  custom_body_scripts: string
}

function getTrackingConfig(): TrackingConfig {
  try {
    const settingsPath = path.join(process.cwd(), 'src/data/site-settings.json')
    const raw = fs.readFileSync(settingsPath, 'utf-8')
    const settings = JSON.parse(raw)
    return settings.tracking || {}
  } catch {
    return {
      google_analytics_id: '',
      google_tag_manager_id: '',
      google_search_console: '',
      facebook_pixel_id: '',
      custom_head_scripts: '',
      custom_body_scripts: '',
    }
  }
}

export default function TrackingScripts() {
  const config = getTrackingConfig()

  const gaId = config.google_analytics_id?.trim()
  const gtmId = config.google_tag_manager_id?.trim()
  const gscCode = config.google_search_console?.trim()
  const fbPixelId = config.facebook_pixel_id?.trim()
  const customHead = config.custom_head_scripts?.trim()
  const customBody = config.custom_body_scripts?.trim()

  // If nothing configured, render nothing
  if (!gaId && !gtmId && !gscCode && !fbPixelId && !customHead && !customBody) {
    return null
  }

  return (
    <>
      {/* Google Search Console verification meta tag */}
      {gscCode && (
        <meta name="google-site-verification" content={gscCode} />
      )}

      {/* Google Analytics 4 (gtag.js) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {fbPixelId && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Custom Head Scripts */}
      {customHead && (
        <Script id="custom-head-scripts" strategy="afterInteractive">
          {customHead}
        </Script>
      )}

      {/* Custom Body Scripts */}
      {customBody && (
        <Script id="custom-body-scripts" strategy="lazyOnload">
          {customBody}
        </Script>
      )}

      {/* GTM noscript iframe (for body) */}
      {gtmId && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </>
  )
}
