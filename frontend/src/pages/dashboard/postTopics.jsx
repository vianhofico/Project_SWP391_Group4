import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import axios from "axios";

export function PostTopics() {

    const [postTopicList, setPostTopicList] = useState([]);
    const [name, setName] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");

    useEffect(() => {
        const fetchPostTopics = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/posttopics`, {
                    params: {
                        name: name,
                        sortOrder: sortOrder
                    }
                });
                setPostTopicList(res.data);
            } catch (err) {
                console.log("Lỗi khi fetch reports:", err);
            }
        }
        fetchPostTopics();
    }, [name, sortOrder]);

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <div className="flex flex-wrap items-center justify-between px-4 gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Search</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Search by name"
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-xs text-gray-600 mb-1">Sort</label>
                        <select
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </select>
                    </div>
                </div>

                <div>
                    <button
                        className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
                        onClick={() => {
                            alert("Chức năng tạo mới topic");
                        }}
                    >
                        Add topic
                    </button>
                </div>
            </div>


            <Card>
                <CardHeader variant="gradient" className="mb-8 p-6 bg-[#4e73df]">
                    <Typography variant="h6" color="white">
                        Topic of Post
                    </Typography>
                </CardHeader>
                <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

                    <table className="w-full min-w-[640px] table-auto">
                        <thead>
                        <tr>
                            {["Topic name", "Created At", "Action"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {postTopicList.map(
                            (topic, index) => {
                                const className = `py-3 px-5 ${
                                    index === postTopicList.length - 1
                                        ? ""
                                        : "border-b border-blue-gray-50"
                                }`;

                                return (
                                    <tr key={topic.postTopicId}>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="max-w-[300px] break-words font-bold"
                                            >
                                                {topic.name}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="ext-[11px] font-bold uppercase text-blue-gray-400"
                                            >
                                                {topic.createdAt}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-xs font-semibold text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="text-xs font-semibold text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>
    );
}

export default PostTopics;
