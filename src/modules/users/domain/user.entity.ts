export class User {
  private readonly id: string;
  private name: string;
  private email: string;
  private password: string;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.setName(name);
    this.setEmail(email);
    this.password = password;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  private setName(name: string) {
    if (name.length < 3) {
      throw new Error('name must be longer or equal to 3 characters');
    }

    this.name = name;
  }

  private setEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      throw new Error('email must be an email');
    }

    this.email = email;
  }

  update(data: { name?: string; email?: string; password?: string }) {
    let updated = false;

    if (data.name) {
      this.setName(data.name);
      updated = true;
    }

    if (data.email) {
      this.setEmail(data.email);
      updated = true;
    }

    if (data.password) {
      this.password = data.password;
      updated = true;
    }

    if (updated) {
      this.updatedAt = new Date();
    }
  }
}
