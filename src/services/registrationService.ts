interface RegistrationData {
  nome: string;
  telefone: string;
  email: string;
  igreja: string;
  redeSocial: string;
  quantidadeMembros: string;
}

export async function submitRegistration(data: RegistrationData) {
  try {
    const response = await fetch('https://n8n-n8n.ibnltq.easypanel.host/webhook/cadastroclient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit registration');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}