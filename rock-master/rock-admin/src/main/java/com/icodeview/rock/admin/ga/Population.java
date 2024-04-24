package com.icodeview.rock.admin.ga;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
public class Population {
    private List<List<Long>> pop;

    public Population(List<List<Long>> pop) {
        this.pop = new ArrayList<>(pop);
        this.setSerialVersionUID(UUID.randomUUID());
    }

    private UUID serialVersionUID = UUID.randomUUID();
}
