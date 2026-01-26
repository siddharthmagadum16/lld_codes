package repository;

import enums.Denomination;
import util.AmountNeeded;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class CashDao {

    private Map<Denomination, Integer> data = new HashMap<>();

    public CashDao(Map<Denomination, Integer> data) {
        this.data = data;
    }

    public void setData(Map<Denomination, Integer> data) {
        this.data = data;
    }

//    private synchronized getAndReduceCash(ArrayList<AmountNeeded> amountNeeded) {
//        int n = amountNeeded.size();
//        for (int i = 0; i < n; ++ i) {
//            if ()
//        }
//    }

    public Integer getAvailableBalanceForDeno(Denomination deno) {
        return data.get(deno);
    }
}
