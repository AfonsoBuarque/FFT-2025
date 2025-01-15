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
    // Using no-cors mode to bypass CORS restrictions
    const response = await fetch('https://n8n-n8n-onlychurch.ibnltq.easypanel.host/webhook/cadastroclient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'no-cors', // Add this to handle CORS issues
      body: JSON.stringify(data)
    });

    // With no-cors mode, we can't access response details
    // So we'll assume success if we get here
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error occurred');
    throw new Error('Failed to submit registration. Please try again later.');
  }
}