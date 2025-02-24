// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const API_KEY = "API123";
const API_PORT = 3000;
const API_BASE_URL = `http://localhost:${API_PORT}`;

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" }
});

const LibraryDashboard = () => {
    const [issuedBooks, setIssuedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

    useEffect(() => {
        const fetchIssuedBooks = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/issuance');

                // Filter based on selected date and only "Issued" books
                const filteredBooks = response.data.filter(issue => 
                    issue.issuance_date.split('T')[0] === selectedDate &&
                    issue.issuance_status === "Issued"
                );

                setIssuedBooks(filteredBooks);
            } catch (error) {
                console.error("Error fetching issued books:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssuedBooks();
    }, [selectedDate]); // Re-fetch when selectedDate changes

    return (
        <div className="container">
            <h1>📚 Library Management System</h1>
            <nav>
                <Link to="/members">👥 Members</Link>
                <Link to="/books">📖 Books</Link>
                <Link to="/issuance">📌 Issuance</Link>
            </nav>

            <section className="card">
                <h2>Issued Books</h2>

                {/* Date Filter */}
                <label htmlFor="date-filter">Select Date:</label>
                <input
                    type="date"
                    id="date-filter"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />

                {loading ? (
                    <div className="loading"></div>
                ) : (
                    issuedBooks.length > 0 ? (
                        <table className="book-table">
                            <thead>
                                <tr>
                                    <th>📖 Book ID</th>
                                    <th>👤 Issued To (Member ID)</th>
                                    <th>📝 Issued By</th>
                                    <th>📅 Issuance Date</th>
                                    <th>⏳ Return By</th>
                                    <th>📌 Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuedBooks.map((issue) => (
                                    <tr key={issue.issuance_id}>
                                        <td>{issue.book_id}</td>
                                        <td>{issue.issuance_member}</td>
                                        <td>{issue.issued_by}</td>
                                        <td>{new Date(issue.issuance_date).toLocaleDateString()}</td>
                                        <td>{new Date(issue.target_return_date).toLocaleDateString()}</td>
                                        <td>{issue.issuance_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="empty-message">No pending books issued on this date.</p>
                    )
                )}
            </section>
        </div>
    );
};

const Members = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newMember, setNewMember] = useState({ mem_name: "", mem_phone: "", mem_email: "" });
    const [editMember, setEditMember] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get("/member");
                setMembers(data);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    const addMember = async () => {
        try {
            const { data } = await axiosInstance.post("/member", newMember);
            setMembers([...members, data]);
            setShowModal(false);
            setNewMember({ mem_name: "", mem_phone: "", mem_email: "" });
        } catch (error) {
            console.error("Error adding member:", error);
        }
    };

    const deleteMember = async (id) => {
        try {
            await axiosInstance.delete(`/member/${id}`);
            setMembers(members.filter(member => member.mem_id !== id));
        } catch (error) {
            console.error("Error deleting member:", error);
        }
    };

    const handleUpdateMember = async () => {
        try {
            await axiosInstance.put(`/member/${editMember.mem_id}`, editMember);
            setMembers(members.map(m => m.mem_id === editMember.mem_id ? editMember : m));
            setEditMember(null);
        } catch (error) {
            console.error("Error updating member:", error);
        }
    };

    return (
        <div className="container members">
            <h2>👥 Members</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>
                ➕ Add Member
            </button>

            {loading ? (
                <div className="loading"></div>
            ) : (
                <ul className="member-list">
                    {members.map(member => (
                        <li key={member.mem_id} className="member-item">
                            <div className="member-info">
                                <span className="member-name">{member.mem_name}</span>
                                <span className="member-details">{member.mem_phone}</span>
                                <span className="member-email">{member.mem_email}</span>
                            </div>
                            <div className="action-buttons">
                                <button className="action-btn edit-btn" onClick={() => setEditMember(member)}>
                                    ✏️ Edit
                                </button>
                                <button className="action-btn delete-btn" onClick={() => deleteMember(member.mem_id)}>
                                    ❌ Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {(showModal || editMember) && (
                <div className="overlay" onClick={() => {
                    setShowModal(false);
                    setEditMember(null);
                }}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>{editMember ? 'Edit Member' : 'Add New Member'}</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            value={editMember ? editMember.mem_name : newMember.mem_name}
                            onChange={e => editMember 
                                ? setEditMember({...editMember, mem_name: e.target.value})
                                : setNewMember({...newMember, mem_name: e.target.value})
                            }
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={editMember ? editMember.mem_phone : newMember.mem_phone}
                            onChange={e => editMember
                                ? setEditMember({...editMember, mem_phone: e.target.value})
                                : setNewMember({...newMember, mem_phone: e.target.value})
                            }
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={editMember ? editMember.mem_email : newMember.mem_email}
                            onChange={e => editMember
                                ? setEditMember({...editMember, mem_email: e.target.value})
                                : setNewMember({...newMember, mem_email: e.target.value})
                            }
                        />
                        <div className="modal-actions">
                            <button className="action-btn" onClick={editMember ? handleUpdateMember : addMember}>
                                {editMember ? 'Update' : 'Add'}
                            </button>
                            <button className="action-btn" onClick={() => {
                                setShowModal(false);
                                setEditMember(null);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({
        book_name: "",
        book_cat_id: "",
        book_collection_id: "",
        book_launch_date: "",
        book_publisher: ""
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get("/book");
                setBooks(data);
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const addBook = async () => {
        try {
            const { data } = await axiosInstance.post("/book", newBook);
            setBooks([...books, data]);
            setShowModal(false);
            setNewBook({
                book_name: "",
                book_cat_id: "",
                book_collection_id: "",
                book_launch_date: "",
                book_publisher: ""
            });
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    const deleteBook = async (id) => {
        try {
            await axiosInstance.delete(`/book/${id}`);
            setBooks(books.filter(book => book.book_id !== id));
        } catch (error) {
            console.error("Error deleting book:", error);
        }
    };

    return (
        <div className="container books">
            <h2>📖 Books</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>
                ➕ Add Book
            </button>

            {loading ? (
                <div className="loading"></div>
            ) : (
                <div className="card-grid">
                    {books.map((book) => (
                        <div key={book.book_id} className="card">
                            <h3 className="book-title">{book.book_name}</h3>
                            <div className="book-details">
                                <p>Publisher: {book.book_publisher}</p>
                                <p>Launch Date: {book.book_launch_date}</p>
                                <p>Category: {book.book_cat_id}</p>
                                <p>Collection: {book.book_collection_id}</p>
                            </div>
                            <button 
                                className="action-btn delete-btn"
                                onClick={() => deleteBook(book.book_id)}
                            >
                                ❌ Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Add New Book</h3>
                        <input
                            type="text"
                            placeholder="Book Name"
                            value={newBook.book_name}
                            onChange={e => setNewBook({...newBook, book_name: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Category ID"
                            value={newBook.book_cat_id}
                            onChange={e => setNewBook({...newBook, book_cat_id: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Collection ID"
                            value={newBook.book_collection_id}
                            onChange={e => setNewBook({...newBook, book_collection_id: e.target.value})}
                        />
                        <input
                            type="date"
                            placeholder="Launch Date"
                            value={newBook.book_launch_date}
                            onChange={e => setNewBook({...newBook, book_launch_date: e.target.value})}
                        />
                        <input
                            type="text"
                            placeholder="Publisher"
                            value={newBook.book_publisher}
                            onChange={e => setNewBook({...newBook, book_publisher: e.target.value})}
                        />
                        <div className="modal-actions">
                            <button className="action-btn" onClick={addBook}>Add</button>
                            <button className="action-btn" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Issuance = () => {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        bookId: '',
        memberId: '',
        issuedBy: '',
        targetReturnDate: '',
        issuanceStatus: 'Issued'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchIssuances();
    }, []);

    const fetchIssuances = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/issuance');
            setIssuances(data);
        } catch (err) {
            setError('Failed to fetch issuances');
            console.error("Error fetching issuances: ", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        const { bookId, memberId, issuedBy, targetReturnDate } = formData;
        if (!bookId || !memberId || !issuedBy || !targetReturnDate) {
            setError('All fields are required!');
            return false;
        }
        return true;
    };

    const issueBook = async () => {
        if (!validateForm()) return;

        const issueData = {
            book_id: formData.bookId,
            issuance_member: formData.memberId,
            issued_by: formData.issuedBy,
            target_return_date: formData.targetReturnDate,
            issuance_status: formData.issuanceStatus
        };

        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/issuance', issueData);
            setIssuances([...issuances, data]);
            setSuccess('Book issued successfully!');
            setError('');

            // Reset form
            setFormData({
                bookId: '',
                memberId: '',
                issuedBy: '',
                targetReturnDate: '',
                issuanceStatus: 'Issued'
            });

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to issue the book. Please try again.');
            console.error("Error issuing book: ", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        const statusMap = {
            'Issued': 'status-issued',
            'Returned': 'status-returned',
            'Overdue': 'status-overdue'
        };
        return `status-badge ${statusMap[status] || 'status-issued'}`;
    };

    return (
        <div className="container issuance">
            <h2>📌 Book Issuance</h2>

            {/* Error and Success Messages */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {/* Issuance Form */}
            <div className="card">
                <h3>Issue New Book</h3>
                <div className="form-group">
                    <input
                        type="text"
                        name="bookId"
                        placeholder="Book ID"
                        value={formData.bookId}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="memberId"
                        placeholder="Member ID"
                        value={formData.memberId}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="issuedBy"
                        placeholder="Issued By (e.g., Admin)"
                        value={formData.issuedBy}
                        onChange={handleInputChange}
                    />
                    <input
                        type="date"
                        name="targetReturnDate"
                        value={formData.targetReturnDate}
                        onChange={handleInputChange}
                    />
                    <select
                        name="issuanceStatus"
                        value={formData.issuanceStatus}
                        onChange={handleInputChange}
                    >
                        <option value="Issued">Issued</option>
                        <option value="Returned">Returned</option>
                        <option value="Overdue">Overdue</option>
                    </select>

                    <button
                        className="add-btn"
                        onClick={issueBook}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Issue Book'}
                    </button>
                </div>
            </div>

            {/* Issued Books List */}
            <div className="card">
                <h3>Issued Books</h3>
                {loading && !issuances.length ? (
                    <div className="loading"></div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Book ID</th>
                                    <th>Member</th>
                                    <th>Issued By</th>
                                    <th>Return Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuances.map((issue) => (
                                    <tr key={issue.issuance_id}>
                                        <td>{issue.book_id}</td>
                                        <td>{issue.issuance_member}</td>
                                        <td>{issue.issued_by}</td>
                                        <td>{issue.target_return_date}</td>
                                        <td>
                                            <span className={getStatusClass(issue.issuance_status)}>
                                                {issue.issuance_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!issuances.length && (
                            <p className="empty-message">No books have been issued yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LibraryDashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/books" element={<Books />} />
                <Route path="/issuance" element={<Issuance />} />
            </Routes>
        </Router>
    );
};

export default App;