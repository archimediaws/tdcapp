=== La Table de Cana App ===

Contributors: Stephane ESCOBAR
Author link: https://stephaneescobar.com/
Tags: restaurant, catering, menu, notification

Requires at least: Ionic Framework and Wordpress website
Tested up to: ionic-angular 3.9.2
Latest Release : currently in Alpha testing
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html


== Description ===


LA TABLE DE CANA App - A WordpPress Mobile Hybrid App for Restaurant and catering services.
Display restaurant menus and notification alert to mobile app users.
Content can be managed by owner to WordPress website backoffice :  very easy to use !

LA TABLE DE CANA App is a very simple Mobile App for Wordpress which allow owner to add customizable content and send notification to their customers.
It has a very user-friendly interface, which allow Wordpress users to easily modify wordpress post content needed for the communication of the restaurant.
The Wordpress website still separately customizable.
This Mobile Hybrid App is basic-user oriented, no code knowledge is required.

features

	★ Retrieve data from the Wordpress website and process it
	★ Display data
  ★ Connect / authenticate the user
  ★ Write, edit, view and delete content
  ★ view offline app data by saving locally
  ★ Share content on social networks
  ★ scan and generate Barcode
  ★ select pictures from camera or library phone
  ★ Contact form
  ★ Phone call
  ★ Map location
  ★ Receive push notifications from Onesignal
  ★ i18n / Internationalization

TRANSLATED IN FOLLOWING LANGUAGES:

- French (proud to be French)
- English (not yet complete)
- Catalan (in progress)


For any problem, please contact me at my website: [CONTACT](https://stephaneescobar.com)


== Installation == ### REQUIREMENTS


### FOR THE WORDPRESS PART OF THIS APP/ PHP server required **Minimum PHP version: 5.3.0**

WP REST API V2 has to be activated first by choosing permalink postname structure in settings -> permalink setting options  - save it !

WordPress plugins installs are required before using app on mobile device

  1. Unzip `all this following plugins` to the `/wp-content/plugins/` directory or select it by "Add new" in the 'Plugins' menu in WordPress

    === JWT Authentication for WP REST API ===
    Extends the WP REST API using JSON Web Tokens Authentication as an authentication method.

    === Pods - Custom Content Types and Fields ===
    Pods is a framework for creating, managing, and deploying customized content types and fields.

    === OneSignal - Free Web Push Notifications ===
    OneSignal is a complete push notification solution for WordPress blogs and websites


  2. Activate these plugins through the 'Plugins' menu in WordPress

  3. Follow each plugin settings :


    3.1 for === JWT Authentication for WP REST API ===

      Follow the instructions on the Setup page.

      ### Make PHP HTTP Authorization Header enable
      Most of the shared hosting has disabled the **HTTP Authorization Header** by default.
      To enable this option you'll need to edit your **.htaccess** file adding the follow

        RewriteEngine on
        RewriteCond %{HTTP:Authorization} ^(.*)
        RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

      ### Configurate the Secret Key

      The JWT needs a **secret key** to sign the token this **secret key** must be unique and never revealed.
      To add the **secret key** edit your wp-config.php file and add a new constant called **JWT_AUTH_SECRET_KEY**

      `
      define('JWT_AUTH_SECRET_KEY', 'your-top-secrect-key');
      `

    3.2 === Pods - Custom Content Types and Fields ===

      Follow the instructions on the Setup page.

      ### Create new pod = menu_du_jour
            add field = prix / text type
            add field = photomdj / media type
            add support for the api rest for this pod

      ### Create new pod = prod
              add field = plu / text type
              add field = imageproduit / media type
              add support for the api rest for this pod

    3.3  === OneSignal - Free Web Push Notifications ===

      Follow the instructions on the Setup page.

      ### create onesignal-filter.php file in wp-content/mu-plugins directory add this follow hook

        add_filter('onesignal_send_notification', 'onesignal_send_notification_filter', 10, 4);


        function onesignal_send_notification_filter($fields, $new_status, $old_status, $post)
        {
          $fields['isAndroid'] = true;
          $fields['isIos'] = true;
          $fields['isAnyWeb'] = false;
          $fields['isChrome'] = false;
          $fields['data'] = array(
            "myappurl" => $fields['url'],
            "action" => "openPage"

          );
          /* Unset the URL to prevent opening the browser when the notification is clicked */
          unset($fields['url']);
          return $fields;
        }


### FOR TESTING APP ON WEB / AND MOBILE DEVICE

  ### Required Node.js and Cordova framework

  Install package.json dependencies
  -> npm install

  Install Cordova/PhoneGap plugins
  -> npm install -g cordova

  Plugins:

  cordova-plugin-camera,
  cordova-plugin-console,
  cordova-plugin-crosswalk-webview,
  cordova-plugin-device,
  cordova-plugin-email,
  cordova-plugin-file,
  cordova-plugin-file-transfer,
  cordova-plugin-filepath,
  cordova-plugin-googlemaps,
  cordova-plugin-inappbrowser,
  cordova-plugin-ionic-keyboard,
  cordova-plugin-ionic-webview,
  cordova-plugin-ios-camera-permissions,
  cordova-plugin-splashscreen,
  cordova-plugin-statusbar,
  cordova-plugin-whitelist,
  cordova-plugin-x-socialsharing,
  cordova-plugin-x-toast,
  es6-promise-plugin,
  onesignal-cordova-plugin,
  phonegap-plugin-barcodescanner


  ### Required ionic framework CLI
  Test the app on multiple screen sizes and platform types by starting a local development server
  -> ionic serve -c

  ### Build iOS
  $ ionic cordova platform add ios
  $ ionic cordova build ios --prod

  ### Build Android
  -> ionic cordova platform add android
  -> ionic cordova build android --prod

== Patterns ==

Angular + Typescript Design Patterns
Module-based Architecture Ionic Framework App as each App Page is a Module (@ngModule).
Architecture is following the official Angular Modularity patterns (AppModule, CoreModule, SharedModule, Modules) https://angular.io/docs/ts/latest/guide/ngmodule.html

== Changelog ==
= 0.0.1 =
currently in Alpha testing

== Notes ==
We accept all kind of suggestion.


