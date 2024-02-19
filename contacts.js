const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const contacts = await readContactsFile();
    console.log("Lista de contacte:", contacts);
  } catch (error) {
    console.error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContactsFile();
    const contact = contacts.find((c) => c.id === contactId);

    if (contact) {
      console.log("Contactul cu ID-ul", contactId, "este:", contact);
    } else {
      console.log("Nu s-a găsit niciun contact cu ID-ul", contactId);
    }
  } catch (error) {
    console.error("Eroare la citirea contactelor:", error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContactsFile();
    const contactToRemove = contacts.find((c) => c.id === contactId);

    if (!contactToRemove) {
      console.log("Nu s-a găsit niciun contact cu ID-ul", contactId);
      return;
    }

    console.log(
      "Datele contactului care urmează să fie șters:",
      contactToRemove
    );
    const updatedContacts = contacts.filter((c) => c.id !== contactId);
    await writeContactsFile(updatedContacts);
    console.log("Contactul cu ID-ul", contactId, "a fost șters.");
  } catch (error) {
    console.error(`Eroare la ștergerea contactului: ${error.message}`);
  }
}

async function addContact(name, email, phone) {
  try {
    if (!name || !email || !phone) {
      throw new Error("Nume, email și telefon sunt obligatorii.");
    }

    const contacts = await readContactsFile();
    const duplicateContact = contacts.find(
      (contact) =>
        contact.name === name ||
        contact.email === email ||
        contact.phone === phone
    );

    if (duplicateContact) {
      console.log(
        "Un contact cu aceleași detalii există deja:",
        duplicateContact
      );
      return;
    }

    const newContact = {
      id: (contacts.length + 1).toString(),
      name,
      email,
      phone,
    };

    const updatedContacts = [...contacts, newContact];
    await writeContactsFile(updatedContacts);
    console.log("Contactul a fost adăugat cu succes:", newContact);
  } catch (error) {
    console.error(`Eroare la adăugarea contactului: ${error.message}`);
  }
}

async function readContactsFile() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data) || [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    } else {
      console.error("Eroare la citirea fișierului de contacte:", error);
      throw error;
    }
  }
}

async function writeContactsFile(contacts) {
  const data = JSON.stringify(contacts, null, 2);
  try {
    await fs.writeFile(contactsPath, data, "utf8");
    console.log("Datele contactelor au fost actualizate cu succes.");
  } catch (err) {
    console.error(`Eroare la scrierea contactelor: ${err.message}`);
    throw err;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
