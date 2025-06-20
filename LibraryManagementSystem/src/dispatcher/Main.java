package dispatcher;



import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Scanner;

public class Main {




    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);// thu vien cho phep thu thap key nguoi dung nhap


        int choice;
        do{
            System.out.println("\n=== Library System Management ===");
            System.out.println("1. Manage Books");
            System.out.println("2. Manage Users");
            System.out.println("3. Managing Borrowing and Returning Books");
            System.out.println("4. Reporting");
            System.out.println("5. Save data to file");
            System.out.println("6. Exit");
            System.out.print("Choose an option: ");

            choice = sc.nextInt(); //han vao so thuc integer : -9 , -1 , 0 , 12, 3

            switch(choice){
                case 1:
                    int choice1;
                    do{
                        System.out.println("1. Add Books");
                        System.out.println("2. Update Books");
                        System.out.println("3. Delete Books");
                        System.out.println("4. Show all Books");
                        System.out.println("5. Exit");
                        System.out.print("Choose an option: ");

                        choice1 = sc.nextInt(); //han vao so thuc integer : -9 , -1 , 0 , 12, 3

                        switch(choice1){
                            case 1:

                                break;

                            case 2:
                                break;

                            case 3:

                                break;

                            case 4:
                                break;

                            case 5:
                                System.out.println("Return to main menu");
                                break;


                            default:       System.out.println("Invalid option, please try again");

                        }

                    }while (choice1!=5);
                    break;

                case 2:
                    int choice2;
                    do{
                        System.out.println("1. Add User");
                        System.out.println("2. Update User");
                        System.out.println("3. Delete User");
                        System.out.println("4. Show all User");
                        System.out.println("5. Exit");
                        System.out.print("Choose an option: ");

                        choice2 = sc.nextInt(); //han vao so thuc integer : -9 , -1 , 0 , 12, 3

                        switch(choice2){
                            case 1:

                                break;

                            case 2:
                                break;

                            case 3:

                                break;

                            case 4:
                                break;

                            case 5:
                                System.out.println("Return to main menu");
                                break;


                            default:       System.out.println("Invalid option, please try again");

                        }

                    }while (choice2!=5);
                    break;

                case 3:

                    break;

                case 4:
                    break;

                case 5:
                    break;

                case 6:
                    System.out.println("Goodbye");
                    System.exit(0);  // Dừng chương trình ngay lập tức
                    break;


                default:       System.out.println("Invalid option, please try again");

            }

        }while (choice!=6);



    }





}
