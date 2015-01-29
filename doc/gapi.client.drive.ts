declare module gapi.client.drive.files {
    /**
     * Gets a file's metadata by ID
     * @param params A key/value map of parameters for the request.
     */
    export function get(params: {
        /**
         * The ID for the file in question.
         */
        fileId: string;
    }): gapi.client.HttpRequest<any>;
}