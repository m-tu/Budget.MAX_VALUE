declare module google.picker {
    /**
     * Use DocsUploadView to upload documents to Google Drive.
     */
    export class DocsUploadView<T> extends View {}

    /**
     * DocsView is a subclass of View that can be used for Google Drive views.
     */
    export class DocsView<T> extends View {}

    /**
     * Feature is an enumerated type, for turning on/off features for various views.
     * Use these values in calls to PickerBuilder.enableFeature and PickerBuilder.disableFeature.
     */
    export class Feature {
        /**
         * Allow user to choose more than one item.
         */
        static MULTISELECT_ENABLED;
    }

    /**
     * Picker is the top level object representing the UI action with the user.
     * These objects are not created directly, but instead use the PickerBuilder object.
     */
    export class Picker<T> {
        /**
         * Control the visibility of the Picker object.
         * @param isVisible
         */
        setVisible(isVisible: boolean): PickerBuilder;
    }

    /**
     * PickerBuilder is used to create Picker objects.
     * Except where noted otherwise, the return type of methods below are of type PickerBuilder,
     * allowing you to chain one call after another.
     */
    export class PickerBuilder<T> {
        /**
         * Add a View to the navigation pane.
         * @param view View | ViewId
         */
        addView(view: View): PickerBuilder;
        /**
         * Sets an OAuth token to use for authenticating the current user.
         * Depending on the scope of the token, only certain views will display data.
         * Valid scopes are Google Docs, Drive, Photos, YouTube
         * @param accessToken
         */
        setOAuthToken(accessToken: string): PickerBuilder;
        /**
         * Enable a picker feature.
         * @param feature
         */
        enableFeature(feature: Feature): PickerBuilder;
        /**
         * Sets the Browser API key obtained from Google Developers Console.
         * See the Developer's Guide for details on how to obtain the Browser API key.
         * @param developerKey
         */
        setDeveloperKey(developerKey: string): PickerBuilder;
        /**
         * Sets the Google Drive App ID needed to allow application to access the user's files via the Google Drive API.
         * @param appId
         */
        setAppId(appId: string): PickerBuilder;
        /**
         * Set the callback method called when the user picks and item (or items), or cancels.
         * The callback method receives a single callback object.
         * The structure of the callback object is described in the JSON Guide.
         * @param callback
         */
        setCallback(callback: (
            response: {}
        ) => void): PickerBuilder;
        /**
         * Construct the Picker object. The Picker object is returned.
         */
        build(): Picker;
    }

    export class View<T> {}

    /**
     * Action is an enumerated type representing the action taken by the user to dismiss the dialog.
     * This value will in the Response.ACTION field in the callback data.
     */
    export class Action {
        /**
         * User canceled the picker dialog.
         */
        static CANCEL;
        /**
         * User has chosen at least one item.
         */
        static PICKED;
    }

    /**
     * Response is an enumerated type used to convey information about the user's picked items.
     */
    export class Response {
        /**
         * An Action type representing the action taken by the user to dismiss the dialog.
         */
        static ACTION;
        /**
         * An array of Documents picked by the user.
         */
        static DOCUMENTS;
    }
}