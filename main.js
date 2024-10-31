let cart = [];
let total = 0;

function addToCart(item, price) {
    cart.push({ item, price, quantity: 1 }); // Adicionando quantidade
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');

    cartItems.innerHTML = '';
    cart.forEach((cartItem) => {
        const li = document.createElement('li');
        li.textContent = `${cartItem.item} - R$ ${cartItem.price.toFixed(2)}`;
        cartItems.appendChild(li);
    });

    totalPrice.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.length;
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const name = prompt("Digite seu nome:");
    const paymentMethod = prompt("Digite a forma de pagamento:");

    if (!name || !paymentMethod) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(16);
    doc.text('QUENTINHAS DO GRAU', 20, 20);
    doc.setFontSize(12);
    doc.text('CNPJ: 12.345.678/0001-90', 20, 30);
    doc.text('Endereço: Rua Exemplo, 123, Centro - Cidade, Estado, CEP: 00000-000', 20, 35);
    doc.text('Telefone: (11) 1234-5678', 20, 40);
    doc.text('Email: contato@quentinhasdograu.com', 20, 45);

    // Data e Hora
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    doc.text(`Data: ${formattedDate}`, 20, 55);
    
    // Informações do Cliente
    doc.text(`Nome do Cliente: ${name}`, 20, 65);
    doc.text(`Forma de Pagamento: ${paymentMethod}`, 20, 70);
    
    // Tabela para Itens
    doc.setFontSize(12);
    doc.text('Itens:', 20, 80);
    doc.setFontSize(10);
    doc.text('Descrição               Quantidade       Preço Unitário       Preço Total', 20, 85);
    doc.line(20, 87, 190, 87); // Linha horizontal

    let yPosition = 90;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        doc.text(`${item.item}`, 20, yPosition);
        doc.text(`${item.quantity}`, 150, yPosition);
        doc.text(`R$ ${item.price.toFixed(2)}`, 170, yPosition);
        doc.text(`R$ ${itemTotal.toFixed(2)}`, 190, yPosition);
        yPosition += 10; // Ajusta a posição vertical para o próximo item
    });

    // Total
    doc.line(20, yPosition, 190, yPosition); // Linha horizontal
    yPosition += 5;
    doc.text(`Total: R$ ${total.toFixed(2)}`, 20, yPosition);

    // Rodapé
    yPosition += 10;
    doc.setFontSize(10);
    doc.text('Obrigado pela sua compra!', 20, yPosition);
    doc.text('Em caso de dúvidas, entre em contato conosco.', 20, yPosition + 5);
    doc.text('Política de devolução: 7 dias após a compra.', 20, yPosition + 10);

    // Salva o PDF
    doc.save('nota_fiscal.pdf');

    // Resetando o carrinho
    cart = [];
    total = 0;
    updateCart();
    closeCart(); // Fecha o modal após a finalização
}

function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Fecha a modal se o usuário clicar fora dela
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCart();
    }
}
