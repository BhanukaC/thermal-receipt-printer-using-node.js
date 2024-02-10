const { Printer, Image } = require("@node-escpos/core");
const USB = require("@node-escpos/usb-adapter");
const { join } = require("path");

const device = new USB();

device.open(async function (err) {
    if (err) {
        console.error('Error opening USB device:', err);
        return;
    }

    try {
        const options = { encoding: "GB18030" /* default */ };
        let printer = new Printer(device, options);

        // Path to logo image (top left)
        const logoFilePath = join("./logo.png");
        const logoImage = await Image.load(logoFilePath);

        // Store name
        const storeName = "DIRTY 2 BEAUTY LAUNDRY";

        // Address
        const address1 = "No.264, Bandarnayaka Mawatha,";
        const address2 = "Katubedaa, Moratuwa";

        // Mobile numbers
        const mobileNumber1 = "Tel: 070 61 61 064";
        const mobileNumber2 = "Tel: 078 61 61 064";

        // Working hours
        const workingHours = "Working Hours: Mon-Sun 7am-6pm";

        // Invoice details
        const invoiceNumber = "Invoice No: 12345";
        const receivedDateTime = "Received: 2024-02-10 10:00 AM";
        const deliveredDateTime = "Delivery: 2024-02-11 11:00 AM";

        // Customer details
        const customerName = "Customer: Bhanuka Uyanage";
        const customerPhone = "Phone: 0775964727";

        // Item details (replace with your own)
        const itemCategories = [
            { name: "Wash & Dry", qty: 1, price: 10, total: 10 },
            // Add more items as needed
        ];

        // Full total, advance payment, remaining payment
        const fullTotal = 10; // Replace with your own calculation
        const advancePayment = 5; // Replace with your own calculation
        const remainingPayment = fullTotal - advancePayment;

        // Thank you message
        const thankYouMessage = "Thank you, Come again!";
        const disclaimer1 = "We are not responsible";
        const disclaimer2 = "after 1 month for any losses";

        // Footer
        const footer = "@ 2024 Code with X  / 077 59 64 727";

        printer = await printer.align("CT").image(
            logoImage,
            "s8" // changing with image,
        )

        // Start printing
        printer
            .font("a")
            .align("ct")
            .style("B")
            .size(1,2)
            .text(storeName).style("NORMAL").size(1,1) // Store name
            .text(address1) // Address1
            .text(address2) // Address2
            .text(mobileNumber1) // Mobile numbers
            .text(mobileNumber2) // Mobile numbers
            .text(workingHours) // Working hours
            .text("-".repeat(48))
            .text(invoiceNumber) // Invoice details
            .text(receivedDateTime)
            .text(deliveredDateTime)
            .text("-".repeat(48))
            .text(customerName) // Customer details
            .text(customerPhone)
            .text("-".repeat(48))
            .align("lt") // Align left for item details
            .tableCustom(
                [
                    { text: "Category", align:"LEFT", width: 0.33, style: "B" },
                    { text: "Qty", align: "LEFT", width: 0.33, style: "B" },
                    { text: "Price", align: "LEFT", width: 0.33, style: "B" },
                    { text: "Total", align: "LEFT", width: 0.33, style: "B" },
                ],
                { encoding: "cp857", size: [1, 1] }
        );

        // Print item categories
        itemCategories.forEach(item => {
            const { name, qty, price, total } = item;
            printer
            .tableCustom(
                [
                    { text: name, align: "LEFT", width: 0.33, style: "B" },
                    { text: qty.toFixed(2), align: "LEFT", width: 0.33, style: "B" },
                    { text: price.toFixed(2), align: "LEFT", width: 0.33, style: "B" },
                    { text: total.toFixed(2), align: "LEFT", width: 0.33, style: "B" },
                ],
                { encoding: "cp857", size: [1, 1] }
            )
        });

        



        // Print totals and messages
        printer
            .font("a")
            .align("ct")
            .text("-".repeat(48))
            .text(`Total Amount: ${fullTotal.toFixed(2)}`)
            .text(`Advance Payment: ${advancePayment.toFixed(2)}`)
            .text(`Remaining Balance: ${remainingPayment.toFixed(2)}`)
            .text("-".repeat(48))
            .text(thankYouMessage)
            .text("-".repeat(48))
            .text(disclaimer1)
            .text(disclaimer2)
            .text("-".repeat(48))
            .text(footer)
            .text("")
            .text("")
            .cut()
            .close();
    } catch (error) {
        console.error('Error printing:', error);
    }
});
