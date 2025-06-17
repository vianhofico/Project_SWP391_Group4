import React, {useEffect, useState} from "react";
import {addPostTopic, editPostTopic} from "@/api/postTopicApi.js";

const PostTopicForm = ({onClose, onSuccess, initialValue}) => {
    const [name, setName] = useState(initialValue?.name || "");
    const topicId = initialValue?.id;

    const createTopic = async (name) => {
        const confirmText = `Are you sure you want to create new topic with name: "${name}"?`;
        if (!window.confirm(confirmText)) return;
        try {
            await addPostTopic(name);
            alert("Add successfully!")
            onSuccess();
            onClose();
        } catch (err) {
            console.log("Lỗi khi thêm topic: ", err);
        }
    }

    const editTopic = async (name) => {
        const confirmText = `Are you sure you want to edit name topic to: "${name}"?`;
        if (!window.confirm(confirmText)) return;
        try {
            await editPostTopic(topicId, name);
            alert("Edit successfully!")
            onSuccess();
            onClose();
        } catch (err) {
            console.log("Lỗi khi edit topic: ", err);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4 text-center">Add new topic</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Topic name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={() =>
                            initialValue ? editTopic(name) : createTopic(name)
                        }
                    >
                        {initialValue ? "Change" : "Add"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PostTopicForm;
