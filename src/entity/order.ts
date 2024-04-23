import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  productName!: string;

  @Column()
  productCategory!: string;

  @Column('numeric') 
  price!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) 
  orderDate!: Date;
}

export default Order;
