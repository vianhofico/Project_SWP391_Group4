import { useState, useEffect } from "react"
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Select,
  Option,
} from "@material-tailwind/react"
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline"
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";


// Mock data
// Mock data cho danh mục khóa học
const mockCategories = [
  { categoryId: 0, name: "All Categories" },
  { categoryId: 1, name: "Programming" },
  { categoryId: 2, name: "Web Development" },
  { categoryId: 3, name: "Data Science" },
  { categoryId: 4, name: "UI/UX Design" },
];

// Cập nhật mockCourses để thêm categoryId
const mockCourses = [
  {
    courseId: 1,
    title: "Master Java Programming",
    description: "Learn Java from basics to advanced concepts, including OOP, Spring, and Hibernate.",
    price: 1200000,
    createdAt: "2025-01-15T10:30:00",
    rating: 4.7,
    imageUrl: "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/watch?v=example1",
    status: true,
    categoryId: 1, // Thuộc danh mục Programming
  },
  {
    courseId: 2,
    title: "ReactJS for Beginners",
    description: "A comprehensive course to build modern web applications using ReactJS.",
    price: 0,
    createdAt: "2025-02-20T14:45:00",
    rating: 4.5,
    imageUrl: "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/watch?v=example2",
    status: true,
    categoryId: 2, // Thuộc danh mục Web Development
  },
  {
    courseId: 3,
    title: "Advanced Python for Data Science",
    description: "Dive into Python for data analysis, machine learning, and visualization.",
    price: 1500000,
    createdAt: "2025-03-10T09:15:00",
    rating: 4.8,
    imageUrl: "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/watch?v=example3",
    status: true,
    categoryId: 3, // Thuộc danh mục Data Science
  },
  {
    courseId: 4,
    title: "UI/UX Design Fundamentals",
    description: "Learn to create user-friendly interfaces with Figma and design principles.",
    price: 800000,
    createdAt: "2025-04-05T16:20:00",
    rating: 4.3,
    imageUrl: "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/watch?v=example4",
    status: false,
    categoryId: 4, // Thuộc danh mục UI/UX Design
  },
  {
    courseId: 5,
    title: "Full-Stack Web Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    price: 2000000,
    createdAt: "2025-05-12T11:00:00",
    rating: 4.9,
    imageUrl: "https://blog.pwskills.com/wp-content/uploads/2024/06/Java-Course-Duration-Syllabus-Eligibility-Salary-Fees.jpg",
    videoTrailerUrl: "https://www.youtube.com/watch?v=example5",
    status: true,
    categoryId: 2, // Thuộc danh mục Web Development
  },
];

const mockUser = {
  userId: 1,
  fullName: "Tran My Linh",
  password: "abc12345",
  email: "huytdnhe180756@fpt.edu.vn",
  birthDate: "01/01/2000",
  role: "USER",
  createdAt: "19/06/2025 11:58",
  status: "Active",
  reportCount: 0,
  imageUrl:
    "https://cdnphoto.dantri.com.vn/Au8icunjIdjAao2SrF0OZWJkRO8=/thumb_w/1360/2025/05/26/jack1-1748272770861.jpg",
}

export function CoursePage() {
  // State management
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0) // 0 represents "All Categories"
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState(mockCourses)
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openPasswordModal, setOpenPasswordModal] = useState(false)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: mockUser.fullName,
    birthDate: "2000-01-01",
    imageUrl: mockUser.imageUrl,
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  })

  // Filter courses based on search query and selected category
  useEffect(() => {
    let filtered = mockCourses.filter((course) => course.status)

    // Filter by category
    if (selectedCategory !== 0) {
      filtered = filtered.filter((course) => course.categoryId === selectedCategory)
    }

    // Filter by search keyword
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((course) => course.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredCourses(filtered)
  }, [searchQuery, selectedCategory])

  // Handle click course detail
    const handleGoToCourseDetail = () => {
    navigate("/test2");
  }

  // Get category name by categoryId
  const getCategoryName = (categoryId) => {
    const category = mockCategories.find((cat) => cat.categoryId === categoryId)
    return category ? category.name : "Unknown"
  }

  // Get category color for chips
  const getCategoryColor = (categoryId) => {
    const colors = {
      1: "blue", // Programming
      2: "green", // Web Development
      3: "purple", // Data Science
      4: "orange", // UI/UX Design
    }
    return colors[categoryId] || "gray"
  }

  // Format price to VND
  const formatPrice = (price) => {
    if (price === 0) return "Free"
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  // Mock handlers
  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => setIsLoggedIn(false)
 const handleRegister = () => {
    console.log("Register clicked");
    navigate("/auth/sign-up");
  }
  const handleUpdateProfile = () => {
    console.log("Profile updated:", formData)
    setOpenUpdateModal(false)
  }
  const handleChangePassword = () => {
    console.log("Password changed:", passwordData)
    setOpenPasswordModal(false)
    setPasswordData({ oldPassword: "", newPassword: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Typography variant="h4" className="text-[#4e73df] font-bold">
                CourseHub
              </Typography>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="!border-gray-300 focus:!border-[#4e73df] pl-10"
                  labelProps={{
                    className: "hidden",
                  }}
                  containerProps={{
                    className: "min-w-0",
                  }}
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Right Side - Login/Register or User Menu */}
            <div className="flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Button
                    onClick={handleLogin}
                    variant="gradient"
                    className="bg-gradient-to-r from-[#4e73df] to-[#224abe]"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={handleRegister}
                    variant="outlined"
                    className="border-[#4e73df] text-[#4e73df] hover:bg-[#4e73df] hover:text-white"
                    size="sm"
                  >
                    Register
                  </Button>
                </>
              ) : (
                <Menu>
                  <MenuHandler>
                    <Button variant="text" className="flex items-center gap-2 p-2">
                      <Avatar src={mockUser.imageUrl} alt={mockUser.fullName} size="sm" variant="circular" />
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem onClick={() => setOpenProfileDialog(true)} className="flex items-center gap-2">
                      <UserCircleIcon className="h-4 w-4" />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <Card className="mb-3">
          <CardHeader variant="gradient" className="mb-4 p-6 bg-gradient-to-r from-[#4e73df] to-[#224abe]">
            <Typography variant="h1" color="white" className="text-center">
              Explore Our Courses
            </Typography>
          </CardHeader>
          <CardBody className="text-center">
            <Typography variant="paragraph" color="blue-gray" className="text-lg">
              Discover a wide range of high-quality courses designed to help you advance your skills and achieve your
              learning goals. From programming to design, we have something for everyone.
            </Typography>
          </CardBody>
        </Card>

        {/* Category Filter Section */}
        <div className="mb-11">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Typography variant="h6" color="blue-gray" className="flex-shrink-0">
                Filter by Category:
              </Typography>
              <div className="w-full sm:w-72">
                <Select
                  value={selectedCategory.toString()}
                  onChange={(value) => setSelectedCategory(Number.parseInt(value))}
                  className="!border-gray-300 focus:!border-[#4e73df]"
                  labelProps={{
                    className: "hidden",
                  }}
                >
                  {mockCategories.map((category) => (
                    <Option key={category.categoryId} value={category.categoryId.toString()}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Typography variant="small" color="gray" className="flex-shrink-0">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} found
              </Typography>
            </div>
          </Card>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.courseId}
                className="hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform mb-5"
              >
                <CardHeader className="relative h-48">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardBody className="p-4">
                  <Typography variant="h5" color="blue-gray" className="mb-2">
                    {course.title}
                  </Typography>

                  {/* Category Chip */}
                  <div className="mb-3">
                    <Chip
                      variant="gradient"
                      color={getCategoryColor(course.categoryId)}
                      value={getCategoryName(course.categoryId)}
                      className="py-1 px-3 text-xs font-medium w-fit"
                    />
                  </div>

                  <Typography variant="small" color="gray" className="mb-4 line-clamp-3">
                    {course.description}
                  </Typography>

                  <div className="flex justify-between items-center mb-4">
                    <Chip
                      variant="gradient"
                      color={course.price === 0 ? "green" : "blue"}
                      value={formatPrice(course.price)}
                      className="py-1 px-3 text-xs font-medium"
                    />
                    <Typography variant="small" color="gray">
                      ⭐ {course.rating}
                    </Typography>
                  </div>

                  <Button variant="gradient" className="bg-gradient-to-r from-[#4e73df] to-[#224abe] w-full" size="sm" onClick={handleGoToCourseDetail} >
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Typography variant="h4" color="gray" className="mb-4">
              No courses found
            </Typography>
            <Typography variant="paragraph" color="gray">
              Try adjusting your search terms or selecting a different category.
            </Typography>
          </div>
        )}
      </main>

      {/* Profile Dialog */}
      <Dialog open={openProfileDialog} handler={() => setOpenProfileDialog(false)} size="md">
        <DialogHeader className="bg-gradient-to-r from-[#4e73df] to-[#224abe] text-white rounded-t-lg">
          User Profile
        </DialogHeader>
        <DialogBody className="text-center p-6">
          <Avatar
            src={mockUser.imageUrl}
            alt={mockUser.fullName}
            size="xxl"
            variant="circular"
            className="mb-4 mx-auto"
          />
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {mockUser.fullName}
          </Typography>
          <Typography variant="small" color="blue-gray" className="mb-2">
            {mockUser.email}
          </Typography>
          <Typography variant="small" color="gray" className="mb-6">
            Birth Date: {mockUser.birthDate}
          </Typography>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                setOpenProfileDialog(false)
                setOpenUpdateModal(true)
              }}
              color="yellow"
              size="sm"
            >
              Update Information
            </Button>
            <Button
              onClick={() => {
                setOpenProfileDialog(false)
                setOpenPasswordModal(true)
              }}
              color="blue"
              size="sm"
            >
              Change Password
            </Button>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenProfileDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Update Profile Modal */}
      <Dialog open={openUpdateModal} handler={() => setOpenUpdateModal(false)} size="sm">
        <DialogHeader>Update Profile Information</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} size="lg" />
            <Input
              label="Birth Date"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleChange}
              size="lg"
            />
            <Input label="Avatar URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} size="lg" />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenUpdateModal(false)} className="mr-2">
            Cancel
          </Button>
          <Button color="green" onClick={handleUpdateProfile}>
            Update
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={openPasswordModal} handler={() => setOpenPasswordModal(false)} size="sm">
        <DialogHeader>Change Password</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-4">
            <Input
              label="Old Password"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              size="lg"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={() => setOpenPasswordModal(false)} className="mr-2">
            Cancel
          </Button>
          <Button color="green" onClick={handleChangePassword}>
            Update Password
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

export default CoursePage;
