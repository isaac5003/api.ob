const newServicePayload = {
  name: 'prueba',
  cost: 14.35,
  sellingType: 3,
  description: 'description',
  incIva: true,
  incRenta5: false,
  incRenta10: false,
};

const editServicePayload = {
  name: 'prueba modificada',
  cost: 20.81,
  sellingType: 2,
  description: 'description modificada',
  incIva: false,
  incRenta5: true,
  incRenta10: false,
};

export { newServicePayload, editServicePayload };
