import React from 'react'

const DetailPost = () => {
    return (
        <>
            <body className="bg-gray-100">

            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <a href="#" className="text-gray-600 hover:text-gray-900 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="h-6 w-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                            </svg>
                        </a>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.5 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M7.217 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm0 1.575a.675.675 0 110 1.35.675.675 0 010-1.35zm0 0V9.525m0 0h.01M12 9.525h.01M16.783 10.907a2.25 2.25 0 100 4.186 2.25 2.25 0 000-4.186zm0 1.575a.675.675 0 110 1.35.675.675 0 010-1.35zm0 0V9.525m0 0h.01M6.006 21H6a2.25 2.25 0 01-2.25-2.25V6A2.25 2.25 0 016 3.75c1.619 0 3.097 1.128 3.675 2.701.05.145.106.286.167.428M21 6a2.25 2.25 0 00-2.25-2.25h-.006c-1.619 0-3.097 1.128-3.675 2.701a18.724 18.724 0 00-.167.428m0 0V21m0 0h-3.379m3.379 0a2.25 2.25 0 01-2.25 2.25H12m0 0a2.25 2.25 0 01-2.25-2.25H6.006"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
                            </svg>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                 stroke="currentColor" className="h-5 w-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                                <path stroke-linecap="round" stroke-linejoin="round"
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                 className="w-5 h-5 text-gray-500 mr-2">
                                <path fill-rule="evenodd"
                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                                      clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What is the best nocode
                            platform?</h1>
                        <p className="text-sm text-gray-500 mb-4">15/01/2025 01:56</p>
                        <span
                            className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-6">Feedback</span>

                        <div className="space-y-5 text-gray-700">
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600">Post</div>
                                <div className="col-span-3 md:col-span-5">
                                    What do you think is the best? I know there are many good platforms today. But is
                                    Softr really the best? I'm starting to think so. Let me know below.
                                </div>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600">Related Link</div>
                                <div className="col-span-3 md:col-span-5">
                                    <a href="http://www.softr.io" target="_blank"
                                       className="text-blue-600 hover:text-blue-800 hover:underline flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.5" stroke="currentColor" className="w-4 h-4 mr-1">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/>
                                        </svg>
                                        www.softr.io
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600 align-top pt-1">Related Image</div>
                                <div className="col-span-3 md:col-span-5">
                                    <img src="https://via.placeholder.com/600x300.png?text=Related+Image+Preview"
                                         alt="Related Image"
                                         className="rounded-md border border-gray-200 max-w-md w-full"/>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-2">
                                <div className="col-span-1 font-medium text-gray-600">Author</div>
                                <div className="col-span-3 md:col-span-5">Moderator</div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center space-x-3">
                            <button
                                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" className="w-5 h-5 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                </svg>
                                Edit Post
                            </button>
                            <button
                                className="text-gray-600 hover:text-red-600 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:border-red-400 flex items-center">
                                Delete Post
                            </button>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 border-t border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Comments</h2>
                        <p className="text-sm text-gray-500 mb-6">Here's a subtitle for a comment block.</p>

                        <div className="bg-white rounded-md border border-gray-300 mb-6">
                            <div
                                className="comment-editor-toolbar flex items-center p-2 border-b border-gray-300 space-x-1 bg-gray-50">
                                <button title="Bold" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M5.5 4.75A.75.75 0 016.25 4h5.5a.75.75 0 01.75.75V8c0 .61-.202 1.187-.558 1.664L8.162 15H7a.75.75 0 01-.75-.75V5.653A3.238 3.238 0 005.5 5.5V4.75zm1.5 0V8a1.75 1.75 0 001.75 1.75h.5a1.75 1.75 0 001.75-1.75V4.75H7z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <button title="Italic" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path
                                            d="M7.75 4.75A.75.75 0 007 5.5v1.259a.75.75 0 001.5 0V6.61l3.303 6.782a.75.75 0 001.447-.702L9.947 5.5H13a.75.75 0 000-1.5H7.75z"/>
                                    </svg>
                                </button>
                                <button title="Underline" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M4.5 3.5A.75.75 0 015.25 3h9.5a.75.75 0 01.75.75v6.25a3.25 3.25 0 01-3.25 3.25H7.25A3.25 3.25 0 014 9.75V3.75A.75.75 0 014.5 3.5zM5.5 4.5v5.25c0 .966.784 1.75 1.75 1.75h5.5A1.75 1.75 0 0014.5 9.75V4.5H5.5zM4 15.75A.75.75 0 014.75 15h10.5a.75.75 0 010 1.5H4.75a.75.75 0 01-.75-.75z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <span className="border-l h-5 mx-1"></span>
                                <button title="Bulleted List" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M2 5.75A.75.75 0 012.75 5h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5.75zM2 9.75A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zM2 13.75a.75.75 0 012.75-1.5h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <button title="Numbered List" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M2 5.75A.75.75 0 012.75 5h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5.75zM2.75 9a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2 13.75a.75.75 0 012.75-1.5h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <button title="Checkbox" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <span className="border-l h-5 mx-1"></span>
                                <button title="Link" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path
                                            d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z"/>
                                        <path
                                            d="M8.603 17.397a2.5 2.5 0 01-3.535-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 005.656 5.656l3-3a4 4 0 00-.225-5.865.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.665l-3 3z"/>
                                    </svg>
                                </button>
                                <button title="Code Block" className="text-gray-600 hover:text-gray-900 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                         className="w-5 h-5">
                                        <path fill-rule="evenodd"
                                              d="M6.28 5.22a.75.75 0 010 1.06L3.56 9l2.72 2.72a.75.75 0 01-1.06 1.06L1.94 9.53a.75.75 0 010-1.06L5.22 5.22a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 11-1.06-1.06L16.44 9l-2.72-2.72a.75.75 0 010-1.06z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                </button>
                                <button title="CB (Custom?)"
                                        className="text-gray-600 hover:text-gray-900 rounded font-mono text-xs">CB
                                </button>
                            </div>
                            <textarea className="w-full h-32 p-3 focus:outline-none resize-y"
                                      placeholder="Add your comment..."></textarea>
                            <div className="p-2 border-t border-gray-300 flex justify-between items-center bg-gray-50">
                                <div className="text-xs text-gray-500">
                                    <span className="font-semibold">Markdown</span> &nbsp; <span
                                    className="font-semibold">WYSIWYG</span>
                                </div>
                                <button
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-md text-sm">
                                    Comment
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-3 p-4 bg-stone-50 rounded-lg">
                                <img src="https://via.placeholder.com/40" alt="User Avatar"
                                     className="h-10 w-10 rounded-full mt-1"/>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-800">User name</h4>
                                        <span className="text-xs text-gray-500">07:00 14 thg 4, 2022</span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700 prose prose-sm max-w-none">
                                        <p>Proxima bellare te tractata Atrides exercet.</p>
                                        <ul>
                                            <li>Lorem markdownum, aequent vocem dixit tamen quidem crimine in maris
                                                protinus moor <strong
                                                    className="font-semibold text-gray-800">telluris</strong> magno,
                                                marinae Latonae.
                                            </li>
                                            <li>Opaca tamquam ligari!</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3 p-4 bg-stone-50 rounded-lg">
                                <img src="https://via.placeholder.com/40" alt="User Avatar"
                                     className="h-10 w-10 rounded-full mt-1"/>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold text-gray-800">User name</h4>
                                        <span className="text-xs text-gray-500">07:00 14 thg 4, 2022</span>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700 prose prose-sm max-w-none">
                                        <p>Proxima bellare te tractata Atrides exercet.</p>
                                        <ul>
                                            <li>Lorem markdownum, aequent vocem dixit tamen quidem crimine in maris
                                                protinus moor <strong
                                                    className="font-semibold text-gray-800">telluris</strong> magno,
                                                marinae Latonae.
                                            </li>
                                            <li>Opaca tamquam ligari!</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center py-8 text-sm text-gray-500">
                <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 hidden md:block">
                    <button
                        className="bg-black text-white p-3 rounded-full shadow-lg hover:bg-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                             stroke="currentColor" className="h-5 w-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                        </svg>
                    </button>
                </div>
                &copy; 2025 UnityHub. All rights reserved.
            </footer>

            <script>
                // Add any necessary JavaScript here, e.g., for comment editor functionality
                // or mobile menu toggles if you reuse the full header.
            </script>

            </body>
        </>
    )
}
export default DetailPost
