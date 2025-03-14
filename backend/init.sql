CREATE TABLE member (
    mem_id SERIAL PRIMARY KEY,
    mem_name VARCHAR(255),
    mem_phone VARCHAR(20),
    mem_email VARCHAR(255)
);

CREATE TABLE membership (
    membership_id SERIAL PRIMARY KEY,
    member_id INT REFERENCES member(mem_id),
    status VARCHAR(50)
);

CREATE TABLE collection (
    collection_id SERIAL PRIMARY KEY,
    collection_name VARCHAR(255)
);

CREATE TABLE category (
    cat_id SERIAL PRIMARY KEY,
    cat_name VARCHAR(255),
    sub_cat_name VARCHAR(255)
);

CREATE TABLE book (
    book_id SERIAL PRIMARY KEY,
    book_name VARCHAR(255),
    book_cat_id INT REFERENCES category(cat_id),
    book_collection_id INT REFERENCES collection(collection_id),
    book_launch_date TIMESTAMP,
    book_publisher VARCHAR(255)
);

CREATE TABLE issuance (
    issuance_id SERIAL PRIMARY KEY,
    book_id INT REFERENCES book(book_id),
    issuance_member INT REFERENCES member(mem_id),
    issuance_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    issued_by VARCHAR(255),
    target_return_date TIMESTAMP,
    issuance_status VARCHAR(50)
);

-- Insert Members
INSERT INTO member (mem_name, mem_phone, mem_email) VALUES
('John Doe', '9876543210', 'john@example.com'),
('Alice Smith', '9876504321', 'alice@example.com');

-- Insert Memberships
INSERT INTO membership (member_id, status) VALUES
(1, 'Active'),
(2, 'Inactive');

-- Insert Collections
INSERT INTO collection (collection_name) VALUES
('Fiction'), ('Non-Fiction');

-- Insert Categories
INSERT INTO category (cat_name, sub_cat_name) VALUES
('Science', 'Physics'), ('Literature', 'Poetry');

-- Insert Books
INSERT INTO book (book_name, book_cat_id, book_collection_id, book_launch_date, book_publisher) VALUES
('A Brief History of Time', 1, 1, '1988-04-01', 'Bantam Books'),
('The Odyssey', 2, 2, '1990-07-10', 'Penguin Classics');

-- Insert Issuance Records
INSERT INTO issuance (book_id, issuance_member, issued_by, target_return_date, issuance_status) VALUES
(1, 1, 'Librarian A', '2024-03-01', 'Issued'),
(2, 2, 'Librarian B', '2024-03-10', 'Returned');
